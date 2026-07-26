import type { App } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as Sentry from '@sentry/vue';
import { capturePocException, initSentry, setPocTestCase, setSentryRouteContext } from './sentry';

vi.mock('@sentry/vue', () => ({
  captureException: vi.fn(),
  init: vi.fn(),
  setContext: vi.fn(),
  setTag: vi.fn(),
  setUser: vi.fn(),
  withScope: vi.fn(),
}));

const runtimeConfig = {
  appId: 'nova-admin-template',
  dsn: 'https://public@example.ingest.sentry.io/1',
  environment: 'test' as const,
  release: 'nova-admin-template@20260726.220000.a1b2c3d',
};

describe('initSentry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not initialize when monitoring is disabled', () => {
    expect(initSentry({} as App, null)).toBe(false);
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('initializes error monitoring with fixed safe context', () => {
    expect(initSentry({} as App, runtimeConfig)).toBe(true);

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: runtimeConfig.dsn,
        environment: 'test',
        release: runtimeConfig.release,
        sendDefaultPii: false,
      }),
    );
    expect(Sentry.setUser).toHaveBeenCalledWith({ id: 'sentry-poc-user' });
    expect(Sentry.setTag).toHaveBeenCalledWith('appId', 'nova-admin-template');
  });

  it('isolates Sentry initialization failures from the application', () => {
    vi.mocked(Sentry.init).mockImplementationOnce(() => {
      throw new Error('Sentry unavailable');
    });

    expect(initSentry({} as App, runtimeConfig)).toBe(false);
  });
});

describe('Sentry event context', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('records route context without query parameters', () => {
    setSentryRouteContext({
      name: 'SentryPoc',
      path: '/examples/sentry-poc',
      title: 'Sentry POC',
    });

    expect(Sentry.setTag).toHaveBeenCalledWith('routeName', 'SentryPoc');
    expect(Sentry.setTag).toHaveBeenCalledWith('routePath', '/examples/sentry-poc');
    expect(Sentry.setContext).toHaveBeenCalledWith('page', {
      routeName: 'SentryPoc',
      routePath: '/examples/sentry-poc',
      pageTitle: 'Sentry POC',
    });
  });

  it('marks automatic POC errors with a stable test case', () => {
    setPocTestCase('unhandled-promise');

    expect(Sentry.setTag).toHaveBeenCalledWith('poc', 'true');
    expect(Sentry.setTag).toHaveBeenCalledWith('testCase', 'unhandled-promise');
    expect(Sentry.setContext).toHaveBeenCalledWith('business', {
      scene: 'sentry-poc',
      testCase: 'unhandled-promise',
    });
  });

  it('captures a manual POC error in an isolated scope', () => {
    const scope = {
      setContext: vi.fn(),
      setLevel: vi.fn(),
      setTag: vi.fn(),
    };
    const error = new Error('Sentry POC manual capture');

    capturePocException(error, 'manual-capture');

    const scopeCallback = vi.mocked(Sentry.withScope).mock.calls[0][0] as
      ((value: typeof scope) => void) | undefined;
    expect(scopeCallback).toBeTypeOf('function');
    scopeCallback?.(scope);

    expect(scope.setTag).toHaveBeenCalledWith('poc', 'true');
    expect(scope.setTag).toHaveBeenCalledWith('testCase', 'manual-capture');
    expect(scope.setLevel).toHaveBeenCalledWith('error');
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });
});

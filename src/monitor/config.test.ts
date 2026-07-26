import { describe, expect, it } from 'vitest';

import { createSentryRuntimeConfig, sanitizeSentryEvent, shouldEnableSentryBuild } from './config';

describe('shouldEnableSentryBuild', () => {
  it('enables source map upload only during an enabled production build', () => {
    expect(shouldEnableSentryBuild('build', true)).toBe(true);
    expect(shouldEnableSentryBuild('serve', true)).toBe(false);
    expect(shouldEnableSentryBuild('build', false)).toBe(false);
  });
});

describe('createSentryRuntimeConfig', () => {
  const validEnv = {
    enabled: 'true',
    environment: 'test',
    dsn: 'https://public@example.ingest.sentry.io/1',
    appVersion: '20260726.220000.a1b2c3d',
  };

  it('enables monitoring only for the configured test environment', () => {
    expect(createSentryRuntimeConfig(validEnv)).toEqual({
      appId: 'nova-admin-template',
      dsn: validEnv.dsn,
      environment: 'test',
      release: 'nova-admin-template@20260726.220000.a1b2c3d',
    });
  });

  it.each([
    { ...validEnv, enabled: 'false' },
    { ...validEnv, environment: 'production' },
    { ...validEnv, dsn: '' },
  ])('disables monitoring when the runtime environment is unsafe', (env) => {
    expect(createSentryRuntimeConfig(env)).toBeNull();
  });
});

describe('sanitizeSentryEvent', () => {
  it('removes sensitive keys and URL query parameters before sending', () => {
    const event = sanitizeSentryEvent({
      request: {
        url: 'https://example.com/orders?token=secret#detail',
        headers: {
          Authorization: 'Bearer secret',
          Accept: 'application/json',
        },
        cookies: {
          session: 'secret',
        },
      },
      user: {
        id: 'sentry-poc-user',
        email: 'private@example.com',
      },
      extra: {
        businessId: 'poc',
        password: 'secret',
      },
    });

    expect(event).toEqual({
      request: {
        url: 'https://example.com/orders',
        headers: {
          Accept: 'application/json',
        },
      },
      user: {
        id: 'sentry-poc-user',
      },
      extra: {
        businessId: 'poc',
      },
    });
  });
});

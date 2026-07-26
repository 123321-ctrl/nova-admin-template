import type { App } from 'vue';
import * as Sentry from '@sentry/vue';

import { sanitizeSentryEvent, SENTRY_POC_USER_ID, type SentryRuntimeConfig } from './config';

export type PocTestCase =
  'js-runtime' | 'unhandled-promise' | 'vue-lifecycle' | 'manual-capture' | 'context-validation';

interface RouteContext {
  name: string;
  path: string;
  title: string;
}

export function initSentry(app: App, config: SentryRuntimeConfig | null): boolean {
  if (!config) {
    return false;
  }

  try {
    Sentry.init({
      app,
      dsn: config.dsn,
      environment: config.environment,
      release: config.release,
      sendDefaultPii: false,
      beforeSend: (event) => sanitizeSentryEvent(event),
    });
    Sentry.setUser({ id: SENTRY_POC_USER_ID });
    Sentry.setTag('appId', config.appId);
    return true;
  } catch {
    return false;
  }
}

export function setSentryRouteContext(route: RouteContext): void {
  Sentry.setTag('routeName', route.name);
  Sentry.setTag('routePath', route.path);
  Sentry.setContext('page', {
    routeName: route.name,
    routePath: route.path,
    pageTitle: route.title,
  });
}

export function setPocTestCase(testCase: PocTestCase): void {
  Sentry.setTag('poc', 'true');
  Sentry.setTag('testCase', testCase);
  Sentry.setContext('business', {
    scene: 'sentry-poc',
    testCase,
  });
}

export function capturePocException(error: Error, testCase: PocTestCase): void {
  Sentry.withScope((scope) => {
    scope.setTag('poc', 'true');
    scope.setTag('testCase', testCase);
    scope.setContext('business', {
      scene: 'sentry-poc',
      testCase,
    });
    scope.setLevel('error');
    Sentry.captureException(error);
  });
}

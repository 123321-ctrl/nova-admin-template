export const SENTRY_APP_ID = 'nova-admin-template';
export const SENTRY_POC_USER_ID = 'sentry-poc-user';

interface SentryRuntimeEnv {
  enabled: string;
  environment: string;
  dsn: string;
  appVersion: string;
}

export interface SentryRuntimeConfig {
  appId: string;
  dsn: string;
  environment: 'test';
  release: string;
}

export function shouldEnableSentryBuild(command: 'build' | 'serve', runtimeEnabled: boolean) {
  return command === 'build' && runtimeEnabled;
}

const sensitiveKeyPattern =
  /authorization|cookie|token|password|passwd|secret|session|email|phone|mobile/i;

export function createSentryRuntimeConfig(env: SentryRuntimeEnv): SentryRuntimeConfig | null {
  if (env.enabled !== 'true' || env.environment !== 'test' || !env.dsn.trim()) {
    return null;
  }

  return {
    appId: SENTRY_APP_ID,
    dsn: env.dsn,
    environment: 'test',
    release: `${SENTRY_APP_ID}@${env.appVersion}`,
  };
}

function stripUrlDetails(value: string): string {
  try {
    const url = new URL(value);
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return value.split(/[?#]/, 1)[0];
  }
}

function sanitizeValue(value: unknown, key = ''): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([entryKey]) => !sensitiveKeyPattern.test(entryKey))
        .map(([entryKey, entryValue]) => [entryKey, sanitizeValue(entryValue, entryKey)]),
    );
  }

  if (typeof value === 'string' && /url$/i.test(key)) {
    return stripUrlDetails(value);
  }

  return value;
}

export function sanitizeSentryEvent<T extends object>(event: T): T {
  return sanitizeValue(event) as T;
}

interface SpaRedirectLocation {
  hash: string;
  pathname: string;
  search: string;
}

export function getRestoredSpaPath(location: SpaRedirectLocation): string | null {
  if (!location.search.startsWith('?/')) {
    return null;
  }

  const route = location.search
    .slice(1)
    .split('&')
    .map((value) => value.replace(/~and~/g, '&'))
    .join('?');
  const basePath = location.pathname.endsWith('/')
    ? location.pathname.slice(0, -1)
    : location.pathname;

  return `${basePath}${route}${location.hash}`;
}

export function restoreGitHubPagesRoute(): void {
  if (typeof window === 'undefined') {
    return;
  }
  const restoredPath = getRestoredSpaPath(window.location);

  if (restoredPath) {
    window.history.replaceState(null, '', restoredPath);
  }
}

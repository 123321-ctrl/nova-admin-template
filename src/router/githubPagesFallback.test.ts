import { describe, expect, it } from 'vitest';

import { getRestoredSpaPath } from './githubPagesFallback';

describe('getRestoredSpaPath', () => {
  it('restores a GitHub Pages redirect to a clean history URL', () => {
    expect(
      getRestoredSpaPath({
        pathname: '/nova-admin-template/',
        search: '?/examples/dataDashboard/statisticalAnalysis&tab=summary~and~range=7d',
        hash: '#chart',
      }),
    ).toBe(
      '/nova-admin-template/examples/dataDashboard/statisticalAnalysis?tab=summary&range=7d#chart',
    );
  });

  it('ignores normal page requests', () => {
    expect(
      getRestoredSpaPath({
        pathname: '/nova-admin-template/',
        search: '?tab=summary',
        hash: '',
      }),
    ).toBeNull();
  });
});

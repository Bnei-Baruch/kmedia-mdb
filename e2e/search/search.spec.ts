import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

// Results content changes constantly — functional assertions only, no snapshots.
test.describe('Search results page', () => {
  test('shows results for a common query', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoSearch('kabbalah');

    await expect(search.results.first()).toBeVisible({ timeout: 30_000 });
    expect(await search.results.count()).toBeGreaterThan(0);
  });

  test('loads without page errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    const search = new SearchPage(page);
    await search.gotoSearch('kabbalah');

    await expect(search.results.first()).toBeVisible({ timeout: 30_000 });
    expect(errors).toHaveLength(0);
  });
});

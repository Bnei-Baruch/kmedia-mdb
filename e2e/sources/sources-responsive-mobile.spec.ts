import { test, expect } from '@playwright/test';
import { SourcesPage } from '../pages/SourcesPage';

test.describe('Sources homepage — mobile layout', () => {
  test('authors list is visible on mobile', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    await expect(sourcesPage.authorsTable).toBeVisible();
  });

  test('each author row stacks correctly (flex row)', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    const firstRow = sourcesPage.authorRows.first();
    await expect(firstRow).toBeVisible();
    const flexDir = await firstRow.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('row');
  });

  test('source list renders single column on mobile', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    const firstList = page.locator('div.index-list .author ul').first();
    await expect(firstList).toBeVisible();
    const columns = await firstList.evaluate(el => getComputedStyle(el).columnCount);
    expect(parseInt(columns)).toBe(1);
  });

  test('source links are tappable (sufficient height)', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    const firstLink = sourcesPage.authorSourceLinks.first();
    await expect(firstLink).toBeVisible();
    const box = await firstLink.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(24);
  });

  test('mobile snapshot matches', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    await expect(page).toHaveScreenshot('sources-list-mobile.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

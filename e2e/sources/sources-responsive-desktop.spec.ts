import { test, expect } from '@playwright/test';
import { SourcesPage } from '../pages/SourcesPage';

test.describe('Sources homepage — desktop layout', () => {
  test('authors list is visible and has flex layout', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    await expect(sourcesPage.authorsTable).toBeVisible();
    const display = await sourcesPage.authorsTable.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
  });

  test('each author row has portrait beside content (flex row)', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    const firstRow = sourcesPage.authorRows.first();
    await expect(firstRow).toBeVisible();
    const flexDir = await firstRow.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('row');
  });

  test('author with portrait renders portrait image', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    const portraits = page.locator('div.author--image img');
    await expect(portraits.first()).toBeVisible();
  });

  test('source list renders multiple columns on desktop', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    const firstList = page.locator('div.index-list .author ul').first();
    await expect(firstList).toBeVisible();
    const columns = await firstList.evaluate(el => getComputedStyle(el).columnCount);
    expect(parseInt(columns)).toBeGreaterThan(1);
  });

  test('desktop snapshot matches', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    await expect(page).toHaveScreenshot('sources-list-desktop.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

import { test, expect } from '@playwright/test';
import { SourcesPage } from '../pages/SourcesPage';

// Runs only on desktop-en and desktop-he (testIgnore: '**/*-desktop.spec.ts' on mobile projects)

const BREAKPOINTS = [
  { name: 'tablet',     width: 768,  height: 1024 },
  { name: 'computer',   width: 1200, height: 900  },
  { name: 'large',      width: 1490, height: 900  },
  { name: 'widescreen', width: 1920, height: 1080 },
] as const;

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

    const firstList = page.getByTestId('sources-index').locator('.author ul').first();
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

for (const { name, width, height } of BREAKPOINTS) {
  test.describe(`Sources homepage — ${name} (${width}px)`, () => {
    test.use({ viewport: { width, height } });

    test('authors list is visible', async ({ page }) => {
      const sourcesPage = new SourcesPage(page);
      await sourcesPage.gotoHomepage();
      await expect(sourcesPage.authorsTable).toBeVisible();
    });

    test('author rows are visible', async ({ page }) => {
      const sourcesPage = new SourcesPage(page);
      await sourcesPage.gotoHomepage();
      await expect(sourcesPage.authorRows.first()).toBeVisible();
    });

    test(`snapshot at ${name}`, async ({ page }) => {
      const sourcesPage = new SourcesPage(page);
      await sourcesPage.gotoHomepage();
      await expect(page).toHaveScreenshot(`sources-list-${name}.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.02,
      });
    });
  });
}

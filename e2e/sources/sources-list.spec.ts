import { test, expect } from '@playwright/test';
import { SourcesPage } from '../pages/SourcesPage';

test.describe('Sources homepage', () => {
  test('loads and shows section header', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    await expect(sourcesPage.sectionHeader).toBeVisible();
    await expect(sourcesPage.sectionTitle).toBeVisible();
  });

  test('shows authors table with rows', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    await expect(sourcesPage.authorsTable).toBeVisible();
    const count = await sourcesPage.authorRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('author rows contain links to source pages', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    await expect(sourcesPage.authorSourceLinks.first()).toBeVisible();
    const count = await sourcesPage.authorSourceLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('no JS errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    expect(errors).toHaveLength(0);
  });

  test('clicking a source link navigates to source route', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    const firstLink = sourcesPage.authorSourceLinks.first();
    await expect(firstLink).toBeVisible();
    await firstLink.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/sources\//);
  });
});

test.describe('Sources homepage — visual snapshots', () => {
  test('default view matches snapshot', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoHomepage();

    await expect(page).toHaveScreenshot('sources-list-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

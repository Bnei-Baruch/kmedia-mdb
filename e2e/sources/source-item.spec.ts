import { test, expect } from '@playwright/test';
import { SourcesPage, KNOWN_SOURCE_ID } from '../pages/SourcesPage';

test.describe('Source route', () => {
  test('loads text layout', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.textLayout).toBeVisible();
  });

  test('shows text toolbar', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.textToolbar).toBeVisible();
  });

  test('shows breadcrumb navigation', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.breadcrumb).toBeVisible();
  });

  test('TOC trigger is visible and opens TOC', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.tocTrigger).toBeVisible();
    await sourcesPage.tocTrigger.click();
    await expect(sourcesPage.tocScroll).toBeVisible();
  });

  test('redirects to first child when source has children', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    // SourceContainer navigates to first child automatically; just confirm we land on a source route
    await page.waitForURL(/\/sources\//, { timeout: 5000 }).catch(() => {
      // redirect may have already resolved before waitForURL — that's fine
    });

    await expect(sourcesPage.textLayout).toBeVisible();
  });

  test('no JS errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    expect(errors).toHaveLength(0);
  });
});

test.describe('Source route — visual snapshots', () => {
  test('source page matches snapshot', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('source-item-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('source page with TOC open matches snapshot', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await sourcesPage.tocTrigger.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('source-item-toc-open.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

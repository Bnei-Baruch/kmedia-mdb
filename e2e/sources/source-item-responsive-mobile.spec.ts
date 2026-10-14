import { test, expect } from '@playwright/test';
import { SourcesPage } from '../pages/SourcesPage';

test.describe('Source item — mobile layout', () => {
  test('text layout fills viewport width', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.textLayout).toBeVisible();
    const box = await sourcesPage.textLayout.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(page.viewportSize()!.width * 0.9);
  });

  test('text toolbar is visible', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.textToolbar).toBeVisible();
  });

  test('breadcrumb is visible', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.breadcrumb).toBeVisible();
  });

  test('TOC trigger is tappable (sufficient touch target height)', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.tocTrigger).toBeVisible();
    const box = await sourcesPage.tocTrigger.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('TOC opens on tap', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await sourcesPage.tocTrigger.tap();
    await expect(sourcesPage.tocScroll).toBeVisible();
  });

  test('mobile snapshot matches', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('source-item-mobile.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

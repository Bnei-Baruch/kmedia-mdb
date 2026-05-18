import { test, expect } from '@playwright/test';
import { SourcesPage } from '../pages/SourcesPage';

test.describe('Source item — desktop layout', () => {
  test('text layout is visible and not full viewport width', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.textLayout).toBeVisible();
    const box = await sourcesPage.textLayout.boundingBox();
    expect(box!.width).toBeLessThan(page.viewportSize()!.width);
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

  test('TOC trigger is visible', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.tocTrigger).toBeVisible();
  });

  test('TOC opens on click', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await sourcesPage.tocTrigger.click();
    await expect(sourcesPage.tocScroll).toBeVisible();
  });

  test('desktop snapshot matches', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('source-item-desktop.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

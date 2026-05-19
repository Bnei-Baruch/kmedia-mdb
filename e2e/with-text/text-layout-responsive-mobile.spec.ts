import { test, expect } from '@playwright/test';
import { WithTextPage } from '../pages/WithTextPage';

test.describe('WithText layout — mobile', () => {
  test('renders with is-mobile class', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await expect(textPage.textLayout).toHaveClass(/is-mobile/);
  });

  test('text mobile padding wrapper is present', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await expect(textPage.mobilePadding).toBeVisible();
  });

  test('toolbar is pinned to the bottom', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await expect(textPage.stickToolbar).toHaveClass(/stick_bottom/);
  });

  test('text layout fills viewport width', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    const box = await textPage.textLayout.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(page.viewportSize()!.width * 0.9);
  });

  test('search bar is visible after tap on search icon', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    await textPage.searchBtnIcon.tap();
    await expect(textPage.searchBar).toBeVisible();
  });

  test('search bar closes on close tap', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    await textPage.searchBtnIcon.tap();
    await textPage.searchCloseBtn.tap();
    await expect(textPage.searchBar).not.toBeVisible();
  });

  test('toolbar buttons have sufficient touch target height', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    const box = await textPage.searchBtnIcon.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(24);
  });

  test('mobile snapshot matches', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('text-layout-mobile.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

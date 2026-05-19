import { test, expect } from '@playwright/test';
import { WithTextPage } from '../pages/WithTextPage';

test.describe('WithText layout — desktop', () => {
  test('renders with is-web class', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await expect(textPage.textLayout).toHaveClass(/is-web/);
  });

  test('text content is narrower than the viewport', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    const box = await textPage.textContent.boundingBox();
    expect(box!.width).toBeLessThan(page.viewportSize()!.width);
  });

  test('toolbar is at the top of the page', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    const box = await textPage.stickToolbar.boundingBox();
    expect(box!.y).toBeLessThan(120);
  });

  test('search input receives focus when search opens', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    await textPage.searchBtnIcon.click();
    await expect(textPage.searchInput).toBeFocused();
  });

  test('search bar is replaced by toolbar on close', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    await textPage.searchBtnIcon.click();
    await expect(textPage.searchBar).toBeVisible();
    await expect(textPage.textToolbar).not.toBeVisible();

    await textPage.searchCloseBtn.click();
    await expect(textPage.searchBar).not.toBeVisible();
    await expect(textPage.textToolbar).toBeVisible();
  });

  test('desktop snapshot matches', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('text-layout-desktop.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

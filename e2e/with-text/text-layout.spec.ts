import { test, expect } from '@playwright/test';
import { WithTextPage } from '../pages/WithTextPage';

test.describe('WithText layout', () => {
  test('text layout renders', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await expect(textPage.textLayout).toBeVisible();
  });

  test('stick toolbar renders', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await expect(textPage.stickToolbar).toBeVisible();
  });

  test('text toolbar buttons render', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await expect(textPage.textToolbar).toBeVisible();
  });

  test('text content renders', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await expect(textPage.textContent).toBeVisible();
  });

  test('search bar appears on search button click', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    await expect(textPage.searchBar).not.toBeVisible();
    await textPage.searchBtnIcon.click();
    await expect(textPage.searchBar).toBeVisible();
    await expect(textPage.searchInput).toBeFocused();
  });

  test('search bar closes on close button click', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    await textPage.searchBtnIcon.click();
    await expect(textPage.searchBar).toBeVisible();

    await textPage.searchCloseBtn.click();
    await expect(textPage.searchBar).not.toBeVisible();
  });

  test('URL contains language prefix', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await expect(page).toHaveURL(/\/(en|he)\//);
  });

  test('no JS errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    const textPage = new WithTextPage(page);
    await textPage.goto();

    expect(errors).toHaveLength(0);
  });
});

test.describe('WithText layout — visual snapshots', () => {
  test('default view matches snapshot', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('text-layout-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('search bar open matches snapshot', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await page.waitForLoadState('networkidle');

    await textPage.searchBtnIcon.click();

    await expect(page).toHaveScreenshot('text-layout-search-open.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

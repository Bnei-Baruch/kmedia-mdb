import { test, expect } from '@playwright/test';
import { SimpleModePage } from '../pages/SimpleModePage';

test.describe('Simple Mode page', () => {
  test('loads and shows section header', async ({ page }) => {
    const simplePage = new SimpleModePage(page);
    await simplePage.goto();

    await expect(simplePage.sectionHeader).toBeVisible();
    await expect(simplePage.sectionTitle).toBeVisible();
  });

  test('loads without JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    const simplePage = new SimpleModePage(page);
    await simplePage.goto();

    await expect(simplePage.sectionHeader).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('shows date navigation controls', async ({ page }) => {
    const simplePage = new SimpleModePage(page);
    await simplePage.goto();

    await expect(simplePage.prevButton).toBeVisible();
    await expect(simplePage.dateDisplay).toBeVisible();
  });

  test('shows language selector', async ({ page }) => {
    const simplePage = new SimpleModePage(page);
    await simplePage.goto();

    await expect(simplePage.languageSelector).toBeVisible();
  });

  test('loads a specific date from URL query param', async ({ page }) => {
    const simplePage = new SimpleModePage(page);
    await simplePage.goto('2024-01-15');

    await expect(simplePage.sectionHeader).toBeVisible();
    const url = page.url();
    expect(url).toContain('date=2024-01-15');
  });

  test('navigates to previous day on prev button click', async ({ page }) => {
    const simplePage = new SimpleModePage(page);
    await simplePage.goto('2024-06-15');

    await simplePage.prevButton.click();
    await page.waitForURL(/date=2024-06-14/);

    expect(page.url()).toContain('date=2024-06-14');
  });

  test('next button is disabled for today', async ({ page }) => {
    const simplePage = new SimpleModePage(page);
    await simplePage.goto();

    await expect(simplePage.nextButton).toBeDisabled();
  });

  test('default view matches snapshot', async ({ page }) => {
    const simplePage = new SimpleModePage(page);
    await simplePage.goto('2024-01-15');

    await expect(page).toHaveScreenshot('simple-mode-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

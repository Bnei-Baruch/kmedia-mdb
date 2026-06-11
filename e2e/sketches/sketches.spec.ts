import { test, expect } from '@playwright/test';
import { SectionListPage } from '../pages/SectionListPage';

test.describe('Sketches page', () => {
  test('loads and shows section header', async ({ page }) => {
    const sketches = new SectionListPage(page, 'sketches');
    await sketches.gotoList();

    await expect(sketches.sectionHeader).toBeVisible();
    await expect(sketches.sectionTitle).toBeVisible();
  });

  test('shows sketch items with images', async ({ page }) => {
    const sketches = new SectionListPage(page, 'sketches');
    await sketches.gotoList();

    // Sketch units render as image thumbnails
    await expect(page.locator('.layout img').first()).toBeVisible();
  });

  test('default view matches snapshot', async ({ page }) => {
    const sketches = new SectionListPage(page, 'sketches');
    await sketches.gotoList();
    await expect(sketches.sectionHeader).toBeVisible();

    await expect(page).toHaveScreenshot('sketches-list-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

import { test, expect } from '@playwright/test';
import { SectionListPage } from '../pages/SectionListPage';

// "Selected excerpts for Lag BaOmer" — likut in production data
export const KNOWN_LIKUT_ID = 'P47yOzSu';

test.describe('Likutim list page', () => {
  test('loads and shows section header', async ({ page }) => {
    const likutim = new SectionListPage(page, 'likutim');
    await likutim.gotoList();

    await expect(likutim.sectionHeader).toBeVisible();
    await expect(likutim.sectionTitle).toBeVisible();
  });

  test('shows links to likutim items', async ({ page }) => {
    const likutim = new SectionListPage(page, 'likutim');
    await likutim.gotoList();

    await expect(likutim.itemLinks.first()).toBeVisible();
    expect(await likutim.itemLinks.count()).toBeGreaterThan(0);
  });

  test('default view matches snapshot', async ({ page }) => {
    const likutim = new SectionListPage(page, 'likutim');
    await likutim.gotoList();
    await expect(likutim.sectionHeader).toBeVisible();

    await expect(page).toHaveScreenshot('likutim-list-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Likut item page', () => {
  test('renders text layout', async ({ page }) => {
    const likutim = new SectionListPage(page, 'likutim');
    await likutim.gotoList(KNOWN_LIKUT_ID);

    await expect(page.locator('.text_layout')).toBeVisible();
  });

  test('likut matches snapshot', async ({ page }) => {
    const likutim = new SectionListPage(page, 'likutim');
    await likutim.gotoList(KNOWN_LIKUT_ID);
    await expect(page.locator('.text_layout')).toBeVisible();

    await expect(page).toHaveScreenshot('likut-item.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

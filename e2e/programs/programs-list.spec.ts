import { test, expect } from '@playwright/test';
import { SectionListPage } from '../pages/SectionListPage';

test.describe('Programs list page', () => {
  test('loads and shows section header', async ({ page }) => {
    const programs = new SectionListPage(page, 'programs');
    await programs.gotoList();

    await expect(programs.sectionHeader).toBeVisible();
    await expect(programs.sectionTitle).toBeVisible();
  });

  test('shows list of items', async ({ page }) => {
    const programs = new SectionListPage(page, 'programs');
    await programs.gotoList();

    await expect(programs.mediaItems.first()).toBeVisible();
    expect(await programs.mediaItems.count()).toBeGreaterThan(0);
  });

  test('pagination is visible when there are results', async ({ page }) => {
    const programs = new SectionListPage(page, 'programs');
    await programs.gotoList();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(programs.pagination).toBeVisible();
  });
});

test.describe('Programs list — visual snapshots', () => {
  test('default view matches snapshot', async ({ page }) => {
    const programs = new SectionListPage(page, 'programs');
    await programs.gotoList();
    await expect(programs.mediaItems.first()).toBeVisible();

    await expect(page).toHaveScreenshot('programs-list-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

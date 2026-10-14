import { test, expect } from '@playwright/test';
import { LessonsListPage, LESSON_TABS } from '../pages/LessonsListPage';

test.describe('Lessons list page', () => {
  test('loads and shows section header', async ({ page }) => {
    const lessonsPage = new LessonsListPage(page);
    await lessonsPage.gotoTab();

    await expect(lessonsPage.sectionHeader).toBeVisible();
    await expect(lessonsPage.sectionTitle).toBeVisible();
  });

  test('shows list of items', async ({ page }) => {
    const lessonsPage = new LessonsListPage(page);
    await lessonsPage.gotoTab();

    await expect(lessonsPage.items.first()).toBeVisible();
    const count = await lessonsPage.items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('daily tab shows daily lesson items', async ({ page }) => {
    const lessonsPage = new LessonsListPage(page);
    await lessonsPage.gotoTab('daily');

    await expect(lessonsPage.dailyItems.first()).toBeVisible();
  });

  test('pagination is visible when there are results', async ({ page }) => {
    const lessonsPage = new LessonsListPage(page);
    await lessonsPage.gotoTab();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(lessonsPage.pagination).toBeVisible();
  });

  for (const tab of LESSON_TABS) {
    test(`tab "${tab}" loads without errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', err => errors.push(err.message));

      const lessonsPage = new LessonsListPage(page);
      await lessonsPage.gotoTab(tab);

      await expect(lessonsPage.sectionHeader).toBeVisible();
      expect(errors).toHaveLength(0);
    });
  }
});

test.describe('Lessons list — visual snapshots', () => {
  test('default view matches snapshot', async ({ page }) => {
    const lessonsPage = new LessonsListPage(page);
    await lessonsPage.gotoTab();

    await expect(page).toHaveScreenshot('lessons-list-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('daily tab matches snapshot', async ({ page }) => {
    const lessonsPage = new LessonsListPage(page);
    await lessonsPage.gotoTab('daily');

    await expect(page).toHaveScreenshot('lessons-list-daily.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

import { test, expect } from '@playwright/test';
import { LessonsListPage } from '../pages/LessonsListPage';
import { LessonItemPage } from '../pages/LessonItemPage';

// below $mobileBreakpoint (480px)
const breakpoints = [
  { name: 'mobile', width: 375, height: 812 },
] as const;

test.describe('Lessons list — mobile', () => {
  for (const bp of breakpoints) {
    test(`lessons list @ ${bp.name} (${bp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      const lessonsPage = new LessonsListPage(page);
      await lessonsPage.gotoTab();

      await expect(lessonsPage.sectionHeader).toBeVisible();
      await expect(lessonsPage.items.first()).toBeVisible();

      await expect(page).toHaveScreenshot(`lessons-list-${bp.name}.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.02,
      });
    });
  }

  test('filter sidebar visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const lessonsPage = new LessonsListPage(page);
    await lessonsPage.gotoTab();

    await expect(lessonsPage.filterSidebar).toBeVisible();
  });
});

test.describe('Lesson item — mobile', () => {
  test('sidebar hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const lessonPage = new LessonItemPage(page);
    await lessonPage.gotoDailyLatest();

    await expect(lessonPage.sidebarItems).toBeHidden();
  });

  for (const bp of breakpoints) {
    test(`lesson item @ ${bp.name} (${bp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      const lessonPage = new LessonItemPage(page);
      await lessonPage.gotoDailyLatest();

      await expect(lessonPage.playerContainer).toBeVisible();

      await expect(page).toHaveScreenshot(`lesson-item-${bp.name}.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});

import { test, expect } from '@playwright/test';
import { LessonsListPage } from '../pages/LessonsListPage';
import { LessonItemPage } from '../pages/LessonItemPage';

// $tabletBreakpoint: 768px, $computerBreakpoint: 1200px,
// $largeMonitorBreakpoint: 1490px, $widescreenMonitorBreakpoint: 1920px
const breakpoints = [
  { name: 'tablet',      width: 768,  height: 1024 },
  { name: 'computer',    width: 1200, height: 800  },
  { name: 'large',       width: 1490, height: 900  },
  { name: 'widescreen',  width: 1920, height: 1080 },
] as const;

test.describe('Lessons list — desktop', () => {
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
});

test.describe('Lesson item — desktop', () => {
  test('sidebar visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    const lessonPage = new LessonItemPage(page);
    await lessonPage.gotoDailyLatest();

    await expect(lessonPage.sidebarItems).toBeVisible();
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

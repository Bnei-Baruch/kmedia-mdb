import { test, expect } from '@playwright/test';
import { LessonItemPage } from '../pages/LessonItemPage';

test.describe('Lesson item page (daily/latest)', () => {
  test('loads player container', async ({ page }) => {
    const lessonPage = new LessonItemPage(page);
    await lessonPage.gotoDailyLatest();

    await expect(lessonPage.playerContainer).toBeVisible();
  });

  test('shows unit info section', async ({ page }) => {
    const lessonPage = new LessonItemPage(page);
    await lessonPage.gotoDailyLatest();

    await expect(lessonPage.unitContainer).toBeVisible();
  });

  test('shows sidebar with playlist on desktop', async ({ page }) => {
    const lessonPage = new LessonItemPage(page);
    await lessonPage.gotoDailyLatest();

    // sidebar is only visible on desktop (hidden via max-md:hidden)
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 768) {
      await expect(lessonPage.sidebarItems).toBeVisible();
    }
  });

  test('no JS errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    const lessonPage = new LessonItemPage(page);
    await lessonPage.gotoDailyLatest();

    expect(errors).toHaveLength(0);
  });
});

test.describe('Lesson item — materials section', () => {
  test('materials tabs visible after scroll', async ({ page }) => {
    const lessonPage = new LessonItemPage(page);
    await lessonPage.gotoDailyLatest();

    await lessonPage.materialsContainer.evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await expect(lessonPage.materialsTabs).toBeVisible();

    await expect(lessonPage.materialsContainer).toHaveScreenshot('lesson-item-materials-top.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  for (const tab of ['transcription', 'sources', 'sketches', 'downloads'] as const) {
    test(`materials tab "${tab}" renders content`, async ({ page }) => {
      const lessonPage = new LessonItemPage(page);
      await lessonPage.gotoDailyLatest();

      await lessonPage.materialsContainer.evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await lessonPage.materialsTab(tab).click();
      await expect(lessonPage.materialsTab(tab)).toHaveClass(/active/);
      // wait for text content fetch + TabsMenu 150ms scroll animation to settle
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(150);

      if (tab === 'transcription') {
        // verify the transcription tab component itself is rendered
        await expect(page.locator('.player_page_tab')).toBeVisible({ timeout: 5000 });
      }

      await expect(lessonPage.materialsContainer).toHaveScreenshot(`lesson-item-tab-${tab}.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});

test.describe('Lesson item — visual snapshots', () => {
  test('daily latest matches snapshot', async ({ page }) => {
    const lessonPage = new LessonItemPage(page);
    await lessonPage.gotoDailyLatest();

    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('lesson-item-daily-latest.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
      mask: [lessonPage.sidebarItems],
    });
  });
});

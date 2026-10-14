import { test, expect } from '@playwright/test';
import { SimpleModePage } from '../pages/SimpleModePage';

const breakpoints = [
  { name: 'mobile', width: 375, height: 812 },
] as const;

test.describe('Simple Mode — mobile', () => {
  test('calendar sidebar hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const simplePage = new SimpleModePage(page);
    await simplePage.goto('2024-01-15');

    await expect(simplePage.stickyCalendar).toBeHidden();
  });

  test('date navigation controls visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const simplePage = new SimpleModePage(page);
    await simplePage.goto('2024-01-15');

    await expect(simplePage.prevButton).toBeVisible();
    await expect(simplePage.dateDisplay).toBeVisible();
  });

  for (const bp of breakpoints) {
    test(`simple mode @ ${bp.name} (${bp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      const simplePage = new SimpleModePage(page);
      await simplePage.goto('2024-01-15');

      await expect(simplePage.sectionHeader).toBeVisible();

      await expect(page).toHaveScreenshot(`simple-mode-${bp.name}.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});

import { test, expect } from '@playwright/test';
import { SimpleModePage } from '../pages/SimpleModePage';

const breakpoints = [
  { name: 'tablet',     width: 768,  height: 1024 },
  { name: 'computer',   width: 1200, height: 800  },
  { name: 'large',      width: 1490, height: 900  },
  { name: 'widescreen', width: 1920, height: 1080 },
] as const;

test.describe('Simple Mode — desktop', () => {
  test('calendar sidebar visible on desktop (lg+)', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    const simplePage = new SimpleModePage(page);
    await simplePage.goto('2024-01-15');

    await expect(simplePage.stickyCalendar).toBeVisible();
    await expect(simplePage.dayPicker).toBeVisible();
  });

  for (const bp of breakpoints) {
    test(`simple mode @ ${bp.name} (${bp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      const simplePage = new SimpleModePage(page);
      await simplePage.goto('2024-01-15');

      await expect(simplePage.sectionHeader).toBeVisible();
      await expect(simplePage.prevButton).toBeVisible();

      await expect(page).toHaveScreenshot(`simple-mode-${bp.name}.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});

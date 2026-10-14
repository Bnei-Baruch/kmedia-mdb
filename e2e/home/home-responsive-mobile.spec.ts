import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

// below $mobileBreakpoint (480px)
const breakpoints = [
  { name: 'mobile', width: 375, height: 812 },
] as const;

test.describe('Home page — mobile', () => {
  for (const bp of breakpoints) {
    test(`home @ ${bp.name} (${bp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      const home = new HomePage(page);
      await home.goto();

      await expect(home.searchBar).toBeVisible();
      await expect(home.latestUpdates).toBeVisible();

      await expect(page).toHaveScreenshot(`home-${bp.name}.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});

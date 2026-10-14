import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

// $tabletBreakpoint: 768px, $computerBreakpoint: 1200px,
// $largeMonitorBreakpoint: 1490px, $widescreenMonitorBreakpoint: 1920px
const breakpoints = [
  { name: 'tablet',      width: 768,  height: 1024 },
  { name: 'computer',    width: 1200, height: 800  },
  { name: 'large',       width: 1490, height: 900  },
  { name: 'widescreen',  width: 1920, height: 1080 },
] as const;

test.describe('Home page — desktop', () => {
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

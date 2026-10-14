import { test, expect } from '@playwright/test';
import { PlayerPage } from '../pages/PlayerPage';

// Runs only on desktop-en and desktop-he (playwright.config.ts ignores *-mobile.spec.ts on desktop)

const BREAKPOINTS = [
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'computer', width: 1200, height: 900 },
  { name: 'large', width: 1490, height: 900 },
  { name: 'widescreen', width: 1920, height: 1080 },
] as const;

for (const { name, width, height } of BREAKPOINTS) {
  test.describe(`Player desktop — ${name} (${width}px)`, () => {
    test.use({ viewport: { width, height } });

    test('player is visible', async ({ page }) => {
      const p = new PlayerPage(page);
      await p.gotoDailyLatest();
      await expect(p.player).toBeVisible();
    });

    test('controls bar is rendered', async ({ page }) => {
      const p = new PlayerPage(page);
      await p.gotoDailyLatest();
      await p.waitForPlayerReady();
      await expect(p.controlsBar).toBeAttached();
    });

    test('volume control is present (web-only)', async ({ page }) => {
      const p = new PlayerPage(page);
      await p.gotoDailyLatest();
      await p.waitForPlayerReady();
      await expect(p.volumeCtrl).toBeAttached();
    });

    test(`player snapshot at ${name}`, async ({ page }) => {
      const p = new PlayerPage(page);
      await p.gotoDailyLatest();
      await p.waitForPlayerReady();
      await page.waitForTimeout(500);
      await expect(p.playerContainer).toHaveScreenshot(`player-desktop-${name}.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  });
}

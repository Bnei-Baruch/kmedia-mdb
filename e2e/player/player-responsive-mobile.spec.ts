import { test, expect } from '@playwright/test';
import { PlayerPage } from '../pages/PlayerPage';

// Runs only on mobile-en and mobile-he (playwright.config.ts ignores *-desktop.spec.ts on mobile)

test.describe('Player mobile — layout', () => {
  test('player wrapper is visible', async ({ page }) => {
    const p = new PlayerPage(page);
    await p.gotoDailyLatest();
    await expect(p.player).toBeVisible();
  });

  test('player-wrapper div is rendered (mobile layout)', async ({ page }) => {
    const p = new PlayerPage(page);
    await p.gotoDailyLatest();
    await p.waitForPlayerReady();
    await expect(p.playerWrapper).toBeVisible();
  });

  test('controls are rendered inside player-wrapper', async ({ page }) => {
    const p = new PlayerPage(page);
    await p.gotoDailyLatest();
    await p.waitForPlayerReady();
    await expect(p.controls).toBeAttached();
  });

  test('mobile controls bar is present', async ({ page }) => {
    const p = new PlayerPage(page);
    await p.gotoDailyLatest();
    await p.waitForPlayerReady();
    await expect(p.controlsBar).toBeAttached();
  });

  test('no volume control on mobile (web-only element)', async ({ page }) => {
    const p = new PlayerPage(page);
    await p.gotoDailyLatest();
    await p.waitForPlayerReady();
    // VolumeCtrl is only rendered in ControlsWeb (desktop), not ControlsMobile
    await expect(p.volumeCtrl).not.toBeAttached();
  });

  test('settings button present on mobile', async ({ page }) => {
    const p = new PlayerPage(page);
    await p.gotoDailyLatest();
    await p.waitForPlayerReady();
    await expect(p.settingsBtn).toBeAttached();
  });

  test('share button present on mobile', async ({ page }) => {
    const p = new PlayerPage(page);
    await p.gotoDailyLatest();
    await p.waitForPlayerReady();
    await expect(p.shareBtn).toBeAttached();
  });

  test('fullscreen button present on mobile', async ({ page }) => {
    const p = new PlayerPage(page);
    await p.gotoDailyLatest();
    await p.waitForPlayerReady();
    await expect(p.fullscreenBtn).toBeAttached();
  });
});

test.describe('Player mobile — visual snapshots', () => {
  test('player at rest matches snapshot', async ({ page }) => {
    const p = new PlayerPage(page);
    await p.gotoDailyLatest();
    await p.waitForPlayerReady();
    await page.waitForTimeout(500);
    await expect(p.playerContainer).toHaveScreenshot('player-mobile-at-rest.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('player with controls visible matches snapshot', async ({ page }) => {
    const p = new PlayerPage(page);
    await p.gotoDailyLatest();
    await p.waitForPlayerReady();
    await p.showControls();
    await page.waitForTimeout(300);
    await expect(p.playerContainer).toHaveScreenshot('player-mobile-controls-visible.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

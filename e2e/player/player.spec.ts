import { test, expect } from '@playwright/test';
import { PlayerPage } from '../pages/PlayerPage';

async function setup(page: ConstructorParameters<typeof PlayerPage>[0]) {
  const playerPage = new PlayerPage(page);
  await playerPage.gotoDailyLatest();
  return playerPage;
}

async function setupReady(page: ConstructorParameters<typeof PlayerPage>[0]) {
  const playerPage = await setup(page);
  await playerPage.waitForPlayerReady();
  return playerPage;
}

// ─── Structure ───────────────────────────────────────────────────────────────

test.describe('Player — structure', () => {
  test('player wrapper is visible', async ({ page }) => {
    const p = await setup(page);
    await expect(p.player).toBeVisible();
  });

  test('JWPlayer mount point exists in DOM', async ({ page }) => {
    const p = await setup(page);
    await expect(p.jwplayer).toBeAttached();
  });

  test('controls element is rendered once player is ready', async ({ page }) => {
    const p = await setupReady(page);
    await expect(p.controls).toBeAttached();
  });

  test('no JS errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await setup(page);
    expect(errors).toHaveLength(0);
  });
});

// ─── Controls bar ─────────────────────────────────────────────────────────────

test.describe('Player — controls bar elements', () => {
  test('play/pause button is present', async ({ page }) => {
    const p = await setupReady(page);
    await expect(p.playPauseBtn).toBeAttached();
  });

  test('progress bar is present', async ({ page }) => {
    const p = await setupReady(page);
    await expect(p.progressBar).toBeAttached();
  });

  test('timecode is present', async ({ page }) => {
    const p = await setupReady(page);
    await expect(p.timecode).toBeAttached();
  });

  test('settings button is present', async ({ page }) => {
    const p = await setupReady(page);
    await expect(p.settingsBtn).toBeAttached();
  });

  test('share button is present', async ({ page }) => {
    const p = await setupReady(page);
    await expect(p.shareBtn).toBeAttached();
  });

  test('fullscreen button is present', async ({ page }) => {
    const p = await setupReady(page);
    await expect(p.fullscreenBtn).toBeAttached();
  });

  test('prev/next buttons are present', async ({ page }) => {
    const p = await setupReady(page);
    // Prev/Next are null when there is no adjacent playlist item — just check one exists
    const prevCount = await p.prevBtn.count();
    const nextCount = await p.nextBtn.count();
    expect(prevCount + nextCount).toBeGreaterThan(0);
  });
});

// ─── Controls visibility ──────────────────────────────────────────────────────

test.describe('Player — controls visibility', () => {
  test('controls become visible after trigger', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await expect(p.controlsBar).toBeVisible();
  });

  test('play/pause button is visible after trigger', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await expect(p.playPauseBtn).toBeVisible();
  });

  test('progress bar is visible after trigger', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await expect(p.progressBar).toBeVisible();
  });
});

// ─── Panel interactions ────────────────────────────────────────────────────────

test.describe('Player — settings panel', () => {
  test('settings panel opens on click', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.settingsBtn.click({ force: true });
    await expect(p.settingsPanel.locator('.settings__pane').first()).toBeVisible({ timeout: 3000 });
  });

  test('settings panel closes on second click', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.settingsBtn.click({ force: true });
    await p.settingsBtn.click({ force: true });
    await expect(p.settingsPanel.locator('.settings__pane').first()).not.toBeVisible({ timeout: 3000 });
  });
});

test.describe('Player — share panel', () => {
  test('sharing panel appears on click', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.shareBtn.click({ force: true });
    await expect(p.sharingPanel).toBeVisible({ timeout: 3000 });
  });

  test('sharing panel disappears on second click', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.shareBtn.click({ force: true });
    await expect(p.sharingPanel).toBeVisible({ timeout: 3000 });
    await p.shareBtn.click({ force: true });
    await expect(p.sharingPanel).not.toBeAttached({ timeout: 3000 });
  });
});

// ─── Settings — rate control ──────────────────────────────────────────────────

test.describe('Player — settings rate control', () => {
  test('rate options are present after opening settings', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.settingsBtn.click({ force: true });
    await expect(p.settingsPanel.locator('.settings__pane').first()).toBeVisible({ timeout: 3000 });
    await expect(p.rateOptions.first()).toBeAttached();
  });

  test('clicking 1.25x rate makes it active', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.settingsBtn.click({ force: true });
    await expect(p.settingsPanel.locator('.settings__pane').first()).toBeVisible({ timeout: 3000 });
    const opt = p.rateOptions.filter({ hasText: '1.25x' });
    await opt.click({ force: true });
    await expect(opt).toHaveClass(/active/);
  });

  test('language selector is present in settings', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.settingsBtn.click({ force: true });
    await expect(p.settingsPanel.locator('.settings__pane').first()).toBeVisible({ timeout: 3000 });
    await expect(p.languageSelect).toBeAttached();
  });
});

// ─── Sharing panel — contents ─────────────────────────────────────────────────

test.describe('Player — sharing panel contents', () => {
  test('sharing panel has start/end time inputs', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.shareBtn.click({ force: true });
    await expect(p.sharingPanel).toBeVisible({ timeout: 3000 });
    await expect(p.sharingTimesPanel).toBeAttached();
  });

  test('sharing panel has reset-to-full button', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.shareBtn.click({ force: true });
    await expect(p.sharingPanel).toBeVisible({ timeout: 3000 });
    await expect(p.sharingResetBtn).toBeAttached();
  });

  test('sharing panel has copy URL input', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.shareBtn.click({ force: true });
    await expect(p.sharingPanel).toBeVisible({ timeout: 3000 });
    await expect(p.sharingUrlInput).toBeAttached();
  });

  test('sharing panel has social share buttons area', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.shareBtn.click({ force: true });
    await expect(p.sharingPanel).toBeVisible({ timeout: 3000 });
    await expect(p.sharingButtons).toBeAttached();
  });
});

// ─── LabelVideo (tagging mode) ────────────────────────────────────────────────

test.describe('Player — LabelVideo tagging panel', () => {
  test('LabelVideo panel appears on tagging button click', async ({ page }) => {
    const p = await setupReady(page);
    await expect(p.taggingBtn).toBeAttached({ timeout: 5000 });
    await p.taggingBtn.click();
    await expect(p.labelVideoPanel).toBeVisible({ timeout: 3000 });
  });

  test('LabelVideo panel has start/end time inputs', async ({ page }) => {
    const p = await setupReady(page);
    await expect(p.taggingBtn).toBeAttached({ timeout: 5000 });
    await p.taggingBtn.click();
    await expect(p.labelVideoTimesPanel).toBeAttached({ timeout: 3000 });
  });

  test('LabelVideo panel closes on second tagging button click', async ({ page }) => {
    const p = await setupReady(page);
    await expect(p.taggingBtn).toBeAttached({ timeout: 5000 });
    await p.taggingBtn.click();
    await expect(p.labelVideoPanel).toBeVisible({ timeout: 3000 });
    await p.taggingBtn.click();
    await expect(p.labelVideoPanel).not.toBeAttached({ timeout: 3000 });
  });
});

// ─── Visual snapshots ──────────────────────────────────────────────────────────

test.describe('Player — visual snapshots', () => {
  test('player at rest matches snapshot', async ({ page }) => {
    const p = await setupReady(page);
    await page.waitForTimeout(500);
    await expect(p.playerContainer).toHaveScreenshot('player-at-rest.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('player controls visible matches snapshot', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await page.waitForTimeout(300);
    await expect(p.playerContainer).toHaveScreenshot('player-controls-visible.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('player settings panel matches snapshot', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.settingsBtn.click({ force: true });
    await page.waitForTimeout(300);
    await expect(p.playerContainer).toHaveScreenshot('player-settings-open.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('player share panel matches snapshot', async ({ page }) => {
    const p = await setupReady(page);
    await p.showControls();
    await p.shareBtn.click({ force: true });
    await page.waitForTimeout(300);
    await expect(p.playerContainer).toHaveScreenshot('player-share-open.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

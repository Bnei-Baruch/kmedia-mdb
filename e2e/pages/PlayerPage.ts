import { Page } from '@playwright/test';
import { LessonItemPage } from './LessonItemPage';

export class PlayerPage extends LessonItemPage {
  constructor(page: Page) {
    super(page);
  }

  // Root player div (dir="ltr" wrapper inside .avbox)
  get player() {
    return this.page.locator('.player');
  }

  // The div that receives mode classes: is-active, is-web, is-mobile, is-video, is-audio
  get playerMode() {
    return this.player.locator('> div').first();
  }

  // JWPlayer mount point
  get jwplayer() {
    return this.page.locator('#jwplayer');
  }

  // Controls overlay (same structure on web and mobile)
  get controls() {
    return this.page.locator('.controls').first();
  }

  // Bottom bar: play/pause, volume, timecode, progress, settings, share, fullscreen
  get controlsBar() {
    return this.page.locator('.controls__bar').first();
  }

  get playPauseBtn() {
    return this.page.locator('.controls__play');
  }

  get prevBtn() {
    return this.page.locator('.controls__prev');
  }

  get nextBtn() {
    return this.page.locator('.controls__next');
  }

  get timecode() {
    return this.page.locator('.controls__timecode');
  }

  get progressBar() {
    return this.page.locator('.controls__progress');
  }

  // Web-only: volume control
  get volumeCtrl() {
    return this.page.locator('.controls__volume');
  }

  get fullscreenBtn() {
    return this.page.locator('.controls__fullscreen');
  }

  // Both use .controls__settings class — filter by icon text
  get settingsBtn() {
    return this.page.locator('.controls__settings').filter({
      has: this.page.locator('.material-symbols-outlined', { hasText: 'settings' }),
    });
  }

  get shareBtn() {
    return this.page.locator('.controls__settings').filter({
      has: this.page.locator('.material-symbols-outlined', { hasText: 'share' }),
    });
  }

  // Settings panel — always in DOM once player ready, shown via CSS when mode=settings
  get settingsPanel() {
    return this.page.locator('.settings');
  }

  // Sharing panel — conditionally rendered, only in DOM when mode=share
  get sharingPanel() {
    return this.page.locator('.sharing');
  }

  // Mobile-specific wrapper
  get playerWrapper() {
    return this.page.locator('.player-wrapper');
  }

  // Settings panel sub-elements
  get rateOptions() {
    return this.settingsPanel.locator('.settings__option');
  }

  get activeRateOption() {
    return this.settingsPanel.locator('.settings__option.active');
  }

  get languageSelect() {
    return this.page.locator('.controls__language select');
  }

  // Sharing panel sub-elements
  get sharingTimesPanel() {
    return this.sharingPanel.locator('.sharing__times');
  }

  get sharingResetBtn() {
    return this.sharingPanel.locator('.sharing__reset');
  }

  get sharingUrlInput() {
    return this.sharingPanel.locator('input[readonly]').first();
  }

  get sharingButtons() {
    return this.sharingPanel.locator('.sharing__buttons');
  }

  // TaggingBtn — opens LabelVideo (tagging mode), located in the page info section
  get taggingBtn() {
    return this.page.locator('.my_tag');
  }

  // LabelVideo panel — .sharing rendered when mode=tagging or mode=playlist
  get labelVideoPanel() {
    return this.page.locator('.sharing');
  }

  get labelVideoTimesPanel() {
    return this.labelVideoPanel.locator('.sharing__times');
  }

  // Wait until ControlsWeb/ControlsMobile has rendered
  async waitForPlayerReady() {
    await this.controls.waitFor({ state: 'attached', timeout: 15_000 });
  }

  // Trigger controls visibility by dispatching mouseenter on the controls bar.
  // On audio daily lesson the player starts in is-first-time (controls already visible),
  // but for video or after the auto-hide timeout we need this.
  async showControls() {
    await this.page.evaluate(() => {
      document.querySelectorAll<HTMLElement>('.controls__bar').forEach(bar => {
        bar.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }));
      });
    });
    await this.page.waitForTimeout(300);
  }
}

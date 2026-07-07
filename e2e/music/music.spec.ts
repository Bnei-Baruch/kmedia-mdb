import { test, expect } from '@playwright/test';
import { SectionListPage } from '../pages/SectionListPage';

// "Songs - World Kabbalah Convention" — songs collection in production data
export const KNOWN_MUSIC_COLLECTION_ID = 'Wf6hSJ3m';

test.describe('Music main page', () => {
  test('loads and shows section header', async ({ page }) => {
    const music = new SectionListPage(page, 'music');
    await music.gotoList();

    await expect(music.sectionHeader).toBeVisible();
    await expect(music.sectionTitle).toBeVisible();
  });

  test('shows links to music collections', async ({ page }) => {
    const music = new SectionListPage(page, 'music');
    await music.gotoList();

    await expect(music.itemLinks.first()).toBeVisible();
    expect(await music.itemLinks.count()).toBeGreaterThan(0);
  });

  test('default view matches snapshot', async ({ page }) => {
    const music = new SectionListPage(page, 'music');
    await music.gotoList();
    await expect(music.sectionHeader).toBeVisible();

    await expect(page).toHaveScreenshot('music-list-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Music collection page', () => {
  test('loads playlist player for songs collection', async ({ page }) => {
    const music = new SectionListPage(page, 'music');
    await music.gotoList(`c/${KNOWN_MUSIC_COLLECTION_ID}`);

    await expect(music.playerContainer).toBeVisible();
  });
});

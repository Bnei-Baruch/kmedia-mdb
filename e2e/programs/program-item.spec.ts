import { test, expect } from '@playwright/test';
import { SectionListPage } from '../pages/SectionListPage';

// "Building a Spiritual Society" — a program collection in production data
export const KNOWN_PROGRAM_COLLECTION_ID = 'ZXFhALqn';
// First chapter of that program
export const KNOWN_PROGRAM_UNIT_ID = 'QzW54n3t';

test.describe('Program collection page', () => {
  test('loads collection with items', async ({ page }) => {
    const programs = new SectionListPage(page, 'programs');
    await programs.gotoList(`c/${KNOWN_PROGRAM_COLLECTION_ID}`);

    await expect(programs.mediaItems.first()).toBeVisible();
  });

  test('collection view matches snapshot', async ({ page }) => {
    const programs = new SectionListPage(page, 'programs');
    await programs.gotoList(`c/${KNOWN_PROGRAM_COLLECTION_ID}`);
    await expect(programs.mediaItems.first()).toBeVisible();

    await expect(page).toHaveScreenshot('program-collection.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Program unit page', () => {
  test('loads player for program chapter', async ({ page }) => {
    const programs = new SectionListPage(page, 'programs');
    await programs.gotoList(`cu/${KNOWN_PROGRAM_UNIT_ID}`);

    await expect(programs.playerContainer).toBeVisible();
  });

  test('unit view matches snapshot', async ({ page }) => {
    const programs = new SectionListPage(page, 'programs');
    await programs.gotoList(`cu/${KNOWN_PROGRAM_UNIT_ID}`);
    await expect(programs.playerContainer).toBeVisible();

    await expect(page).toHaveScreenshot('program-unit.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

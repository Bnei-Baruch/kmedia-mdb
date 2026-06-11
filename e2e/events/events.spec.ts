import { test, expect } from '@playwright/test';
import { SectionListPage } from '../pages/SectionListPage';

// World Kabbalah Convention "Gathering in Tens" (May 2026) — congress in production data
export const KNOWN_EVENT_COLLECTION_ID = 'kjJg1okl';
// Lesson 0 part 1 of that convention
export const KNOWN_EVENT_UNIT_ID = 'XAsi5l26';

test.describe('Events main page', () => {
  test('loads and shows section header', async ({ page }) => {
    const events = new SectionListPage(page, 'events');
    await events.gotoList();

    await expect(events.sectionHeader).toBeVisible();
    await expect(events.sectionTitle).toBeVisible();
  });

  test('shows list of items', async ({ page }) => {
    const events = new SectionListPage(page, 'events');
    await events.gotoList();

    await expect(events.mediaItems.first()).toBeVisible();
  });

  test('default view matches snapshot', async ({ page }) => {
    const events = new SectionListPage(page, 'events');
    await events.gotoList();
    await expect(events.sectionHeader).toBeVisible();

    await expect(page).toHaveScreenshot('events-list-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Event collection page', () => {
  test('loads playlist player for congress', async ({ page }) => {
    const events = new SectionListPage(page, 'events');
    await events.gotoList(`c/${KNOWN_EVENT_COLLECTION_ID}`);

    await expect(events.playerContainer).toBeVisible();
  });
});

test.describe('Event unit page', () => {
  test('loads player for event unit', async ({ page }) => {
    const events = new SectionListPage(page, 'events');
    await events.gotoList(`cu/${KNOWN_EVENT_UNIT_ID}`);

    await expect(events.playerContainer).toBeVisible();
  });

  test('unit view matches snapshot', async ({ page }) => {
    const events = new SectionListPage(page, 'events');
    await events.gotoList(`cu/${KNOWN_EVENT_UNIT_ID}`);
    await expect(events.playerContainer).toBeVisible();

    await expect(page).toHaveScreenshot('event-unit.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

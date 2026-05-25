import { test, expect } from '@playwright/test';
import { TopicsPage, KNOWN_TOPIC_ID } from '../pages/TopicsPage';

test.describe('Topic detail page', () => {
  test('loads and shows breadcrumb navigation', async ({ page }) => {
    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoTopic();

    await expect(topicsPage.breadcrumb).toBeVisible();
    const items = topicsPage.breadcrumb.locator('li');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('shows filter sidebar', async ({ page }) => {
    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoTopic();

    await expect(topicsPage.filterSidebar).toBeVisible();
  });

  test('shows media items', async ({ page }) => {
    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoTopic();

    await expect(topicsPage.mediaItems.first()).toBeVisible();
    const count = await topicsPage.mediaItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('shows pagination when results exist', async ({ page }) => {
    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoTopic();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(topicsPage.pagination).toBeVisible();
  });

  test('no JS errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoTopic();

    expect(errors).toHaveLength(0);
  });

  test('URL contains topic id', async ({ page }) => {
    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoTopic();

    await expect(page).toHaveURL(new RegExp(`/topics/${KNOWN_TOPIC_ID}`));
  });
});

test.describe('Topic detail — visual snapshots', () => {
  test('default view matches snapshot', async ({ page }) => {
    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoTopic();

    await expect(page).toHaveScreenshot('topic-item-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

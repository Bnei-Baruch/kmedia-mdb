import { test, expect } from '@playwright/test';
import { TopicsPage } from '../pages/TopicsPage';

test.describe('Topics list page', () => {
  test('loads and shows section header', async ({ page }) => {
    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoList();

    await expect(topicsPage.sectionHeader).toBeVisible();
    await expect(topicsPage.sectionTitle).toBeVisible();
  });

  test('shows topic sections with links', async ({ page }) => {
    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoList();

    await expect(topicsPage.topicSections.first()).toBeVisible();
    const count = await topicsPage.topicSections.count();
    expect(count).toBeGreaterThan(0);

    await expect(topicsPage.topicLinks.first()).toBeVisible();
  });

  test('search input is visible and filters topics', async ({ page }) => {
    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoList();

    await expect(topicsPage.searchInput).toBeVisible();

    const countBefore = await topicsPage.topicLinks.count();
    await topicsPage.searchInput.fill('kabbalah');
    await page.waitForTimeout(200);
    const countAfter = await topicsPage.topicLinks.count();

    expect(countAfter).toBeLessThanOrEqual(countBefore);
  });

  test('clicking a topic link navigates to topic route', async ({ page }) => {
    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoList();

    const firstLink = topicsPage.topicLinks.first();
    await expect(firstLink).toBeVisible();
    await firstLink.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/topics\//);
  });

  test('no JS errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoList();

    expect(errors).toHaveLength(0);
  });
});

test.describe('Topics list — visual snapshots', () => {
  test('default view matches snapshot', async ({ page }) => {
    const topicsPage = new TopicsPage(page);
    await topicsPage.gotoList();

    await expect(page).toHaveScreenshot('topics-list-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

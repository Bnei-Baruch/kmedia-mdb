import { test, expect } from '@playwright/test';
import { PublicationsPage, PUBLICATIONS_TABS } from '../pages/PublicationsPage';

test.describe('Publications main page', () => {
  test('loads default tab with section header', async ({ page }) => {
    const publications = new PublicationsPage(page);
    await publications.gotoTab();

    await expect(publications.sectionHeader).toBeVisible();
  });

  test('blog tab shows posts', async ({ page }) => {
    const publications = new PublicationsPage(page);
    await publications.gotoTab('blog');

    await expect(publications.posts.first()).toBeVisible();
    expect(await publications.posts.count()).toBeGreaterThan(0);
  });

  for (const tab of PUBLICATIONS_TABS) {
    test(`tab "${tab}" loads without errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', err => errors.push(err.message));

      const publications = new PublicationsPage(page);
      await publications.gotoTab(tab);

      await expect(publications.sectionHeader).toBeVisible();
      expect(errors).toHaveLength(0);
    });
  }
});

test.describe('Publications — visual snapshots', () => {
  test('blog tab matches snapshot', async ({ page }) => {
    const publications = new PublicationsPage(page);
    await publications.gotoTab('blog');
    await expect(publications.posts.first()).toBeVisible();

    await expect(page).toHaveScreenshot('publications-blog.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('articles tab matches snapshot', async ({ page }) => {
    const publications = new PublicationsPage(page);
    await publications.gotoTab('articles');
    await expect(publications.sectionHeader).toBeVisible();

    await expect(page).toHaveScreenshot('publications-articles.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

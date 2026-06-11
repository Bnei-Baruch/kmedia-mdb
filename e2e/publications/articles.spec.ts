import { test, expect } from '@playwright/test';
import { PublicationsPage } from '../pages/PublicationsPage';

test.describe('Article unit page', () => {
  test('loads article with section header', async ({ page }) => {
    const publications = new PublicationsPage(page);
    await publications.gotoArticle();

    await expect(publications.sectionHeader.first()).toBeVisible();
  });

  test('article matches snapshot', async ({ page }) => {
    const publications = new PublicationsPage(page);
    await publications.gotoArticle();
    await expect(publications.sectionHeader.first()).toBeVisible();

    await expect(page).toHaveScreenshot('article-unit.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Article collection page', () => {
  // On production the SPA renders an empty content area for this route (it is only
  // fully rendered server-side for bots), so assert the shell + document title and
  // rely on the snapshot to surface layout changes.
  test('loads collection of articles', async ({ page }) => {
    const publications = new PublicationsPage(page);
    await publications.gotoArticleCollection();

    await expect(page.locator('.layout')).toBeVisible();
    await expect(page).not.toHaveTitle(/^Kabbalah Media$/);
  });

  test('article collection matches snapshot', async ({ page }) => {
    const publications = new PublicationsPage(page);
    await publications.gotoArticleCollection();
    await expect(page.locator('.layout')).toBeVisible();

    await expect(page).toHaveScreenshot('article-collection.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

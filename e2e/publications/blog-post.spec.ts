import { test, expect } from '@playwright/test';
import { PublicationsPage } from '../pages/PublicationsPage';

test.describe('Blog post page', () => {
  test('loads a single blog post', async ({ page }) => {
    const publications = new PublicationsPage(page);
    await publications.gotoBlogPost();

    await expect(publications.blogPost).toBeVisible();
  });

  test('blog post matches snapshot', async ({ page }) => {
    const publications = new PublicationsPage(page);
    await publications.gotoBlogPost();
    await expect(publications.blogPost).toBeVisible();

    await expect(page).toHaveScreenshot('blog-post.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

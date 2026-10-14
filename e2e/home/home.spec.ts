import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Home page', () => {
  test('loads with search bar and latest updates', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(home.searchBar).toBeVisible();
    await expect(home.latestUpdates).toBeVisible();
  });

  test('shows blog posts section', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.socialSection.scrollIntoViewIfNeeded();
    await expect(home.blogPosts).toBeVisible();
  });

  test('loads without page errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    const home = new HomePage(page);
    await home.goto();

    await expect(home.searchBar).toBeVisible();
    expect(errors).toHaveLength(0);
  });
});

test.describe('Home page — visual snapshots', () => {
  test('default view matches snapshot', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.latestUpdates).toBeVisible();

    await expect(page).toHaveScreenshot('home-default.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

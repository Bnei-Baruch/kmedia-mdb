import { test, expect } from '@playwright/test';
import { BookmarksPage } from '../pages/BookmarksPage';

test.describe('Bookmarks page', () => {
  test('loads without JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    const bookmarksPage = new BookmarksPage(page);
    await bookmarksPage.goto();

    expect(errors).toHaveLength(0);
  });

  test('shows need-to-login prompt when unauthenticated', async ({ page }) => {
    const bookmarksPage = new BookmarksPage(page);
    await bookmarksPage.goto();

    await expect(bookmarksPage.needToLogin).toBeVisible();
  });

  test('need-to-login prompt includes a login link', async ({ page }) => {
    const bookmarksPage = new BookmarksPage(page);
    await bookmarksPage.goto();

    await expect(bookmarksPage.loginLink).toBeVisible();
  });

  test('header and footer are present', async ({ page }) => {
    const bookmarksPage = new BookmarksPage(page);
    await bookmarksPage.goto();

    await expect(bookmarksPage.header).toBeVisible();
    await expect(bookmarksPage.footer).toBeVisible();
  });
});

test.describe('Bookmarks page — visual snapshots', () => {
  test('unauthenticated view matches snapshot', async ({ page }) => {
    const bookmarksPage = new BookmarksPage(page);
    await bookmarksPage.goto();

    await expect(page).toHaveScreenshot('bookmarks-unauthenticated.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

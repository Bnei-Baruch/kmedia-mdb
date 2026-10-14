import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BookmarksPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/bookmarks');
  }

  // Unauthenticated state
  get needToLogin() {
    return this.page.locator('.need_to_login');
  }

  get loginLink() {
    return this.page.locator('.need_to_login a');
  }

  // Authenticated state — main page
  get bookmarkPage() {
    return this.page.locator('.bookmark_page');
  }

  get pageHeader() {
    return this.page.locator('.my_header');
  }

  // Bookmark search input (in header)
  get bookmarkSearch() {
    return this.page.locator('.bookmark_page .bookmark_search').first();
  }

  // Folders panel
  get foldersPanel() {
    return this.page.locator('.folders_list');
  }

  get folderItems() {
    return this.page.locator('.folders_list [class*="folder_item"], .folders_list li');
  }

  // Bookmark list
  get bookmarkList() {
    return this.page.locator('.bookmark_page ul.divide-y');
  }

  get bookmarkItems() {
    return this.page.locator('.bookmark_page ul.divide-y > li');
  }
}

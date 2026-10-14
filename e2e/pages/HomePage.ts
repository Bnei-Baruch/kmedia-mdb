import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('');
  }

  get homepage() {
    return this.page.locator('.homepage');
  }

  get searchBar() {
    return this.page.locator('.search-omnibox').first();
  }

  get latestUpdates() {
    return this.page.locator('.homepage__thumbnails');
  }

  get socialSection() {
    return this.page.locator('.home-social-section');
  }

  get blogPosts() {
    return this.page.locator('.home-blog-posts');
  }

  get twitterFeed() {
    return this.page.locator('.home-twitter');
  }

  get sectionLinks() {
    return this.page.locator('a[href*="/lessons"], a[href*="/programs"]');
  }
}

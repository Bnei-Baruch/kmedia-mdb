import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoSearch(q: string) {
    await super.goto(`/search?q=${encodeURIComponent(q)}&page=1`);
  }

  // Search hits are rendered as media items
  get results() {
    return this.page.locator('.media_item');
  }

  get resultsHeader() {
    return this.page.locator('.section-header');
  }

  get pagination() {
    return this.page.locator('.ui.pagination, [aria-label="Pagination"]');
  }
}

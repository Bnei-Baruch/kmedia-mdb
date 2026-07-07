import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// A known root topic that exists in production data (VUpFlBnu is first in TOPICS_FOR_DISPLAY)
export const KNOWN_TOPIC_ID = 'VUpFlBnu';

export class TopicsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList() {
    await super.goto('/topics');
  }

  async gotoTopic(id: string = KNOWN_TOPIC_ID) {
    await super.goto(`/topics/${id}`);
  }

  // Topics list selectors
  get sectionHeader() {
    return this.page.locator('.section-header');
  }

  get sectionTitle() {
    return this.page.locator('.section-header__title');
  }

  get searchInput() {
    return this.page.locator('.search-omnibox');
  }

  get topicSections() {
    return this.page.locator('.topics__section');
  }

  get topicLinks() {
    return this.page.locator('a[href*="/topics/"]');
  }

  get showMoreButtons() {
    return this.page.locator('.topics__button');
  }

  // Topic detail selectors
  get breadcrumb() {
    return this.page.locator('nav ol');
  }

  get filterSidebar() {
    return this.page.locator('.filters-aside-wrapper');
  }

  get mediaItems() {
    return this.page.locator('.media_item');
  }

  get pagination() {
    return this.page.locator('[aria-label="Pagination"]');
  }
}

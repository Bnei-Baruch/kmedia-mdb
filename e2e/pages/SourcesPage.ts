import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// A known Baal HaSulam source that exists in production data
export const KNOWN_SOURCE_ID = 'hFeGidcS';

export class SourcesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoHomepage() {
    await super.goto('/sources');
  }

  async gotoSource(id: string = KNOWN_SOURCE_ID) {
    await super.goto(`/sources/${id}`);
  }

  // Sources homepage selectors
  get sectionHeader() {
    return this.page.locator('.section-header');
  }

  get sectionTitle() {
    return this.page.locator('.section-header__title');
  }

  get authorsTable() {
    return this.page.getByTestId('sources-index');
  }

  get authorRows() {
    return this.page.getByTestId('sources-index').locator('.author');
  }

  get authorSourceLinks() {
    return this.page.getByTestId('sources-index').locator('a[href*="/sources/"]');
  }

  // Source route selectors
  get textLayout() {
    return this.page.locator('.text_layout');
  }

  get textToolbar() {
    return this.page.locator('.text_toolbar');
  }

  get tocTrigger() {
    return this.page.locator('.toc_trigger').first();
  }

  get tocScroll() {
    return this.page.locator('.toc_scroll');
  }

  get breadcrumb() {
    return this.page.locator('.text_toolbar__breadcrumb');
  }
}

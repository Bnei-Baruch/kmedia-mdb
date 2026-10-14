import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Sources route renders the full WithText layout (TextLayoutWeb / TextLayoutMobile + toolbar + text content).
// Replace with a known Likutim ID once one is confirmed for the test environment.
const KNOWN_ID = 'hFeGidcS';

export class WithTextPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto(`sources/${KNOWN_ID}`);
  }

  // Layout wrappers
  get textLayout() {
    return this.page.locator('.text_layout');
  }

  get stickToolbar() {
    return this.page.locator('.stick_toolbar').first();
  }

  get textToolbar() {
    return this.page.locator('.text_toolbar');
  }

  get textContent() {
    return this.page.locator('.text__content-wrapper');
  }

  // Mobile-specific
  get mobilePadding() {
    return this.page.locator('.text_mobile_padding');
  }

  // Search — clicking the icon works for both desktop (.button wrapper) and mobile (flex div)
  get searchBtnIcon() {
    return this.page
      .locator('.text_toolbar__buttons .material-symbols-outlined')
      .filter({ hasText: 'search' });
  }

  get searchBar() {
    return this.page.locator('.text__search_on_page');
  }

  get searchInput() {
    return this.page.locator('.text__search_on_page input');
  }

  get searchCloseBtn() {
    return this.page.locator('.text__search_on_page_close');
  }
}

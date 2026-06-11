import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Generic page object for filterable section list pages
// (programs, events, music, likutim, sketches share the same shell).
export class SectionListPage extends BasePage {
  constructor(page: Page, private basePath: string) {
    super(page);
  }

  async gotoList(sub?: string) {
    const path = sub ? `/${this.basePath}/${sub}` : `/${this.basePath}`;
    await super.goto(path);
  }

  get sectionHeader() {
    return this.page.locator('.section-header');
  }

  get sectionTitle() {
    return this.page.locator('.section-header__title');
  }

  get mediaItems() {
    return this.page.locator('.media_item');
  }

  // Items rendered by list templates (likutim, music) link to their own section.
  // The trailing slash excludes the bare nav link to the section itself.
  get itemLinks() {
    return this.page.locator(`a[href*="/${this.basePath}/"]`);
  }

  get pagination() {
    return this.page.locator('.ui.pagination, .pagination-wrapper, [aria-label="Pagination"]').first();
  }

  // Playlist pages (c/:id, cu/:id) render the player inside .avbox
  get playerContainer() {
    return this.page.locator('.avbox').first();
  }
}

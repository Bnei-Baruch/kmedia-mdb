import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const LESSON_TABS = ['daily', 'virtual', 'lectures', 'women', 'rabash', 'children', 'series'] as const;
export type LessonTab = typeof LESSON_TABS[number];

export class LessonsListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoTab(tab?: LessonTab) {
    const path = tab ? `/lessons/${tab}` : '/lessons';
    await super.goto(path);
  }

  get sectionHeader() {
    return this.page.locator('.section-header');
  }

  get sectionTitle() {
    return this.page.locator('.section-header__title');
  }

  get filterSidebar() {
    return this.page.locator('.filters-aside, [class*="FiltersAside"], form').first();
  }

  get items() {
    return this.page.locator('.media_item');
  }

  get dailyItems() {
    return this.page.locator('.media_item.daily_lesson');
  }

  get pagination() {
    return this.page.locator('.ui.pagination, [aria-label="Pagination"]');
  }
}

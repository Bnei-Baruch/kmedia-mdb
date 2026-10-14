import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LessonItemPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(id: string) {
    await super.goto(`/lessons/cu/${id}`);
  }

  async gotoDailyLatest() {
    await super.goto('/lessons/daily/latest');
  }

  get playerContainer() {
    return this.page.locator('.avbox').first();
  }

  get playlistHeader() {
    return this.page.locator('.avbox').first().locator('h1, h2, h3').first();
  }

  get unitContainer() {
    return this.page.locator('#unit_container');
  }

  get materialsContainer() {
    return this.page.locator('.unit-materials');
  }

  get materialsTabs() {
    return this.page.locator('nav.tabs.no_print');
  }

  materialsTab(name: 'transcription' | 'sources' | 'sketches' | 'downloads') {
    return this.page.locator(`.tab-${name}.item`);
  }

  get sidebarItems() {
    // desktop only — hidden on mobile
    return this.page.locator('.max-w-\\[36\\%\\]');
  }
}

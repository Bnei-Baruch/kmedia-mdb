import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SimpleModePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(date?: string) {
    const path = date ? `simple-mode?date=${date}` : 'simple-mode';
    await super.goto(path);
  }

  get sectionHeader() {
    return this.page.locator('.section-header');
  }

  get sectionTitle() {
    return this.page.locator('.section-header__title');
  }

  get prevButton() {
    return this.page.locator('.controller button').first();
  }

  get nextButton() {
    return this.page.locator('.controller button').nth(1);
  }

  get dateDisplay() {
    return this.page.locator('.date-container span, .date-container input[type="text"]').first();
  }

  get languageSelector() {
    return this.page.locator('.controller').nth(1);
  }

  get contentList() {
    return this.page.locator('ul.large');
  }

  get contentItems() {
    return this.page.locator('li.unit-header');
  }

  get stickyCalendar() {
    return this.page.locator('.stick-calendar');
  }

  get dayPicker() {
    return this.page.locator('.DayPicker');
  }

  get noFilesMessage() {
    return this.page.locator('.no-files-found, .splash, [class*="Splash"]').first();
  }
}

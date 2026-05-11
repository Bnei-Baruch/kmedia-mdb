import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  // baseURL in playwright.config.ts already includes the language prefix (/en or /he)
  async goto(path: string) {
    await this.page.goto(path.replace(/^\//, ''));
    await this.page.waitForLoadState('networkidle');
  }

  get header() {
    return this.page.locator('[class*="header"], nav').first();
  }

  get footer() {
    return this.page.locator('footer').first();
  }
}

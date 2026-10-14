import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const PUBLICATIONS_TABS = ['blog', 'twitter', 'articles', 'audio-blog'] as const;
export type PublicationsTab = typeof PUBLICATIONS_TABS[number];

// A long-lived laitman.com blog post that exists in production data
export const KNOWN_BLOG = 'laitman-com';
export const KNOWN_BLOG_POST_ID = '344634';

// Known article unit / collection in production data
export const KNOWN_ARTICLE_UNIT_ID = 'xt21yW6c';
export const KNOWN_ARTICLE_COLLECTION_ID = 'qWEUE1Wg';

export class PublicationsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoTab(tab?: PublicationsTab) {
    const path = tab ? `/publications/${tab}` : '/publications';
    await super.goto(path);
  }

  async gotoBlogPost(blog: string = KNOWN_BLOG, id: string = KNOWN_BLOG_POST_ID) {
    await super.goto(`/publications/blog/${blog}/${id}`);
  }

  async gotoArticle(id: string = KNOWN_ARTICLE_UNIT_ID) {
    await super.goto(`/publications/articles/cu/${id}`);
  }

  async gotoArticleCollection(id: string = KNOWN_ARTICLE_COLLECTION_ID) {
    await super.goto(`/publications/articles/c/${id}`);
  }

  get sectionHeader() {
    return this.page.locator('.section-header');
  }

  get tabsMenu() {
    return this.page.locator('.section-header__menu, nav.tabs').first();
  }

  get posts() {
    return this.page.locator('.post');
  }

  get mediaItems() {
    return this.page.locator('.media_item');
  }

  // Blog post page
  get blogPost() {
    return this.page.locator('.blog-post');
  }
}

import { test, expect } from '@playwright/test';
import { WithTextPage } from '../pages/WithTextPage';

// Runs only on desktop-en and desktop-he (testIgnore: '**/*-desktop.spec.ts' on mobile projects)

const BREAKPOINTS = [
  { name: 'tablet',     width: 768,  height: 1024 },
  { name: 'computer',   width: 1200, height: 900  },
  { name: 'large',      width: 1490, height: 900  },
  { name: 'widescreen', width: 1920, height: 1080 },
] as const;

test.describe('WithText layout — desktop', () => {
  test('renders with is-web class', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await expect(textPage.textLayout).toHaveClass(/is-web/);
  });

  test('text content is narrower than the viewport', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    const box = await textPage.textContent.boundingBox();
    expect(box!.width).toBeLessThan(page.viewportSize()!.width);
  });

  test('toolbar is at the top of the page', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    const box = await textPage.stickToolbar.boundingBox();
    expect(box!.y).toBeLessThan(120);
  });

  test('search input receives focus when search opens', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    await textPage.searchBtnIcon.click();
    await expect(textPage.searchInput).toBeFocused();
  });

  test('search bar is replaced by toolbar on close', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();

    await textPage.searchBtnIcon.click();
    await expect(textPage.searchBar).toBeVisible();
    await expect(textPage.textToolbar).not.toBeVisible();

    await textPage.searchCloseBtn.click();
    await expect(textPage.searchBar).not.toBeVisible();
    await expect(textPage.textToolbar).toBeVisible();
  });

  test('desktop snapshot matches', async ({ page }) => {
    const textPage = new WithTextPage(page);
    await textPage.goto();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('text-layout-desktop.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

for (const { name, width, height } of BREAKPOINTS) {
  test.describe(`WithText layout — ${name} (${width}px)`, () => {
    test.use({ viewport: { width, height } });

    test('text layout is visible', async ({ page }) => {
      const textPage = new WithTextPage(page);
      await textPage.goto();
      await expect(textPage.textLayout).toBeVisible();
    });

    test('text content is narrower than viewport', async ({ page }) => {
      const textPage = new WithTextPage(page);
      await textPage.goto();
      const box = await textPage.textContent.boundingBox();
      expect(box!.width).toBeLessThan(page.viewportSize()!.width);
    });

    test(`snapshot at ${name}`, async ({ page }) => {
      const textPage = new WithTextPage(page);
      await textPage.goto();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot(`text-layout-desktop-${name}.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.02,
      });
    });
  });
}

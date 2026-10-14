import { test, expect } from '@playwright/test';
import { SourcesPage } from '../pages/SourcesPage';

// Runs only on desktop-en and desktop-he (testIgnore: '**/*-desktop.spec.ts' on mobile projects)

const BREAKPOINTS = [
  { name: 'tablet',     width: 768,  height: 1024 },
  { name: 'computer',   width: 1200, height: 900  },
  { name: 'large',      width: 1490, height: 900  },
  { name: 'widescreen', width: 1920, height: 1080 },
] as const;

test.describe('Source item — desktop layout', () => {
  test('text layout is visible and not full viewport width', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.textLayout).toBeVisible();
    const box = await sourcesPage.textLayout.boundingBox();
    expect(box!.width).toBeLessThan(page.viewportSize()!.width);
  });

  test('text toolbar is visible', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.textToolbar).toBeVisible();
  });

  test('breadcrumb is visible', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.breadcrumb).toBeVisible();
  });

  test('TOC trigger is visible', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await expect(sourcesPage.tocTrigger).toBeVisible();
  });

  test('TOC opens on click', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await sourcesPage.tocTrigger.click();
    await expect(sourcesPage.tocScroll).toBeVisible();
  });

  test('desktop snapshot matches', async ({ page }) => {
    const sourcesPage = new SourcesPage(page);
    await sourcesPage.gotoSource();

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('source-item-desktop.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

for (const { name, width, height } of BREAKPOINTS) {
  test.describe(`Source item — ${name} (${width}px)`, () => {
    test.use({ viewport: { width, height } });

    test('text layout is visible', async ({ page }) => {
      const sourcesPage = new SourcesPage(page);
      await sourcesPage.gotoSource();
      await expect(sourcesPage.textLayout).toBeVisible();
    });

    test('text layout is narrower than viewport', async ({ page }) => {
      const sourcesPage = new SourcesPage(page);
      await sourcesPage.gotoSource();
      const box = await sourcesPage.textLayout.boundingBox();
      expect(box!.width).toBeLessThan(page.viewportSize()!.width);
    });

    test('text toolbar is visible', async ({ page }) => {
      const sourcesPage = new SourcesPage(page);
      await sourcesPage.gotoSource();
      await expect(sourcesPage.textToolbar).toBeVisible();
    });

    test(`snapshot at ${name}`, async ({ page }) => {
      const sourcesPage = new SourcesPage(page);
      await sourcesPage.gotoSource();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot(`source-item-${name}.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.02,
      });
    });
  });
}

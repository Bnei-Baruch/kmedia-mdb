import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

// Known kabbalist slug (see src/components/Sections/Sources/Kabbalist.jsx mapLinks)
export const KNOWN_PERSON_ID = 'baal-hasulam';

test.describe('Help page', () => {
  test('loads with section header and cards', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/help');

    await expect(page.locator('.section-header')).toBeVisible();
    await expect(page.locator('.card').first()).toBeVisible();
  });

  test('help matches snapshot', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/help');
    await expect(page.locator('.section-header')).toBeVisible();

    await expect(page).toHaveScreenshot('help.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('About page', () => {
  // Content container may be empty in some languages (e.g. /en/about on production),
  // so assert presence in DOM, not visibility.
  test('loads with text content container', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/about');

    await expect(page.locator('.readble-width').first()).toBeAttached();
  });

  test('about matches snapshot', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/about');
    await expect(page.locator('.readble-width').first()).toBeAttached();

    await expect(page).toHaveScreenshot('about.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Person page', () => {
  test('loads kabbalist biography', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto(`/persons/${KNOWN_PERSON_ID}`);

    await expect(page.locator('.library-person, .readble-width').first()).toBeVisible();
  });

  test('person matches snapshot', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto(`/persons/${KNOWN_PERSON_ID}`);
    await expect(page.locator('.library-person, .readble-width').first()).toBeVisible();

    await expect(page).toHaveScreenshot('person.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});

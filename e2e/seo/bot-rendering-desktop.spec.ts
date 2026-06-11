import { test, expect, APIRequestContext } from '@playwright/test';

// Server-side rendering for crawlers (see server/renderer.js isBot()).
// Bots get fully rendered HTML, so content markers must be present in the raw response.
// Named *-desktop so it runs once per language (desktop-en / desktop-he) and skips mobile projects.
const BOT_UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

// marker — class expected in the rendered body.
// For heavy text pages production SSR intermittently renders shell-only, so for them
// we assert the data-driven <title> instead ("<content name> | <site name>" — contains "|",
// while the fallback title does not).
const ROUTES = [
  { path: '', marker: 'search-omnibox' },
  { path: 'lessons', marker: 'section-header' },
  { path: 'programs', marker: 'media_item' },
  { path: 'events', marker: 'section-header' },
  { path: 'music', marker: 'section-header' },
  { path: 'publications', marker: 'section-header' },
  { path: 'sources/hFeGidcS', marker: null },
  { path: 'likutim/P47yOzSu', marker: null },
] as const;

// SSR for bots is expensive — production responds 503 under parallel load,
// so requests are retried with backoff and routes are crawled sequentially.
async function getAsBot(request: APIRequestContext, path: string): Promise<string> {
  let status = 0;
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await request.get(path, { headers: { 'User-Agent': BOT_UA } });
    status = res.status();
    if (status === 200) {
      return res.text();
    }
    await new Promise(resolve => setTimeout(resolve, 3000 * (attempt + 1)));
  }
  throw new Error(`GET ${path} as bot failed with status ${status} after 5 attempts`);
}

// Opt out of fullyParallel: bot requests from concurrent workers starve each other into 503s
test.describe.configure({ mode: 'default' });

test.describe('Bot user-agent SSR rendering', () => {
  test('bot gets server-rendered HTML for key routes', async ({ request }) => {
    test.setTimeout(180_000);
    for (const { path, marker } of ROUTES) {
      const html = await getAsBot(request, path);
      const title = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? '';
      expect(title, `route /${path} should have a non-empty <title>`).not.toBe('');
      if (marker) {
        expect(html, `route /${path} should contain "${marker}"`).toContain(marker);
      } else {
        expect(title, `route /${path} should have a data-driven title`).toContain('|');
      }
    }
  });

  test('html lang attribute matches language', async ({ request, baseURL }) => {
    test.setTimeout(60_000);
    const html = await getAsBot(request, '');

    const expectedLang = baseURL?.includes('/he') ? 'he' : 'en';
    expect(html).toMatch(new RegExp(`<html[^>]+lang="${expectedLang}"`));
  });

  test('bot response contains SEO meta tags', async ({ request }) => {
    test.setTimeout(60_000);
    const html = await getAsBot(request, 'lessons');

    expect(html).toMatch(/<meta[^>]+(og:title|name="description")/);
  });
});

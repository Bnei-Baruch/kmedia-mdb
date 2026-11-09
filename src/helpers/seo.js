import { LANGUAGES } from './consts';

export const SITE_URL  = (process.env.REACT_APP_BASE_URL || 'https://kabbalahmedia.info/').replace(/\/?$/, '/');
export const SITE_NAME = 'Kabbalah Media';

// Absolute site URL for a language-prefixed app path ("/lessons/cu/x" -> "https://.../en/lessons/cu/x").
export const absoluteUrl = (lang, pathname = '', search = '') => {
  const path = `${pathname}`.replace(/^\/+/, '');
  const q    = `${search || ''}`.replace(/^\?/, '');
  return `${SITE_URL}${lang ? `${lang}/` : ''}${path}${q ? `?${q}` : ''}`;
};

// Query params that don't change the page content (player position, UI tab, auth/tracking noise).
// Dropped from canonical, og:url and hreflang so every variant of a page collapses to one URL.
export const NON_CANONICAL_PARAMS = ['sstart', 'send', 'language', 'ap', 'activeTab', 'authorised', 'fbclid', 'gclid'];
const isNonCanonicalParam = key => NON_CANONICAL_PARAMS.includes(key) || key.startsWith('utm_');

/**
 * Normalized page path (no language prefix, no leading/trailing slash) + content-relevant query.
 * Single source for <link rel=canonical>, og:url and hreflang alternates — they must always agree.
 *   ("/en/lessons/cu/x/?sstart=10s&activeTab=sources", "en") -> "lessons/cu/x"
 *   ("/he/lessons/gr-abc", "he")                            -> "lessons/abc"
 */
export const canonicalPath = (originalUrl, lang) => {
  const [rawPath, rawQuery = ''] = `${originalUrl || ''}`.split('?');

  let path = rawPath;
  if (lang && (path === `/${lang}` || path.startsWith(`/${lang}/`))) {
    path = path.substring(lang.length + 1);
  }

  path = path.replace(/^\/+|\/+$/g, '');

  const gr = /(.+)\/gr-(.+)$/.exec(path);
  if (gr) path = `${gr[1]}/${gr[2]}`;

  const params = new URLSearchParams(rawQuery);
  [...params.keys()].filter(isNonCanonicalParam).forEach(k => params.delete(k));
  const query = params.toString();

  return query ? `${path}?${query}` : path;
};

// ISO 8601 duration from seconds: 3725 -> "PT1H2M5S"
export const isoDuration = seconds => {
  const s = Math.round(Number(seconds));
  if (!s || s <= 0) return undefined;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${r || (!h && !m) ? `${r}S` : ''}`;
};

// Plain text suitable for meta description / schema: no tags, collapsed whitespace, cut on a word boundary.
export const seoText = (text, max = 160) => {
  if (!text) return '';
  const plain = `${text}`.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  const sp  = cut.lastIndexOf(' ');
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,.;:–-]+$/, '')}…`;
};

// BCP 47 language tag for schema.org inLanguage ("ua" -> "uk").
export const bcp47 = lang => LANGUAGES[lang]?.locale?.substring(0, 2) || lang;

// Drop undefined/null/'' values recursively so JSON-LD stays clean.
export const compact = obj => {
  if (Array.isArray(obj)) return obj.map(compact).filter(v => v !== undefined);
  if (obj && typeof obj === 'object') {
    const out = {};
    Object.entries(obj).forEach(([k, v]) => {
      const c = compact(v);
      if (c === undefined || c === null || c === '' || (Array.isArray(c) && !c.length)) return;
      out[k] = c;
    });
    return out;
  }

  return obj;
};

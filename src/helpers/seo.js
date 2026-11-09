import { LANGUAGES } from './consts';

export const SITE_URL  = (process.env.REACT_APP_BASE_URL || 'https://kabbalahmedia.info/').replace(/\/?$/, '/');
export const SITE_NAME = 'Kabbalah Media';

// Absolute site URL for a language-prefixed app path ("/lessons/cu/x" -> "https://.../en/lessons/cu/x").
export const absoluteUrl = (lang, pathname = '', search = '') => {
  const path = `${pathname}`.replace(/^\/+/, '');
  const q    = `${search || ''}`.replace(/^\?/, '');
  return `${SITE_URL}${lang ? `${lang}/` : ''}${path}${q ? `?${q}` : ''}`;
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

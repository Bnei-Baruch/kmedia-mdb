import { Requests } from '../src/helpers/Api';
import { canonicalLink } from '../src/helpers/links';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const LANG_MAP = {
  en: 'en',
  he: 'he',
  ru: 'ru',
  es: 'es',
  de: 'en',
  tr: 'en',
  ua: 'ua',
  '': '',
};

function kmRedirect(req, res, path) {
  const lang = LANG_MAP[req.params.lang || ''];
  let p      = path;
  if (!lang && p.startsWith('/')) {
    p = p.substring(1);
  }
  res.redirect(301, `${BASE_URL}${lang}${p}`);
}

export async function kmediaContainer(req, res, next) {
  console.log('kmediaContainer', req.originalUrl);
  switch (req.params.cnID) {
  case 'homepage':
  case 'google_ads':
  case 'lesson_downloader':
  case 'index.php':
    kmRedirect(req, res, '/');
    break;
  default:
    await Requests.get(`content_units?${Requests.makeParams({ kmedia_id: req.params.cnID })}`)
      .then((resp) => {
        const { data: { total, content_units: cus } } = resp;
        if (total === 1) {
          kmRedirect(req, res, canonicalLink(cus[0]));
        } else {
          kmRedirect(req, res, '/');
        }
      })
      .catch(next);
  }
}

export async function kmediaSearch(req, res, next) {
  console.log('kmediaSearch', req.query);
  const { search } = req.query;

  if (!search) {
    kmRedirect(req, res, '/');
    return;
  }

  if (search.query_string) {
    // free text search
    kmRedirect(req, res, `/search?${Requests.makeParams({ q: search.query_string })}`);
    return;
  } else if (search.catalog_ids) {
    // catalog mode
    await Requests.get(`collections?${Requests.makeParams({ kmedia_id: search.catalog_ids })}`)
      .then((resp) => {
        const { data: { total, collections: cs } } = resp;
        if (total === 1) {
          kmRedirect(req, res, canonicalLink(cs[0]));
        } else {
          kmRedirect(req, res, '/');
        }
      })
      .catch(next);
    return;
  }

  kmRedirect(req, res, '/');
}

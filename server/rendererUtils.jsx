import { parse as cookieParse } from 'cookie';
import fs from 'fs';
import { createMemoryHistory } from 'history';
import pick from 'lodash/pick';
import { setDayjsLocale } from '../src/helpers/dayjs';
import path from 'path';
import { PassThrough } from 'stream';
import { renderToPipeableStream } from 'react-dom/server';
import { matchRoutes } from 'react-router-dom';
import serialize from 'serialize-javascript';
import { URL } from 'url';
import { AppServer } from '../src/components/App/AppServer';
import logger from '../src/logger/logger.js';
import i18next from 'i18next';
import i18nextBackend from 'i18next-fs-backend';
import { options, registerDateFormats } from '../src/helpers/i18nnext';
import {
  COOKIE_CONTENT_LANGS,
  COOKIE_SHOW_ALL_CONTENT,
  COOKIE_UI_LANG,
  KC_BOT_USER_NAME,
  LANG_UI_LANGUAGES,
} from '../src/helpers/consts';
import { getDeviceInfo } from '../src/helpers/deviceInfo';
import { getLanguageDirection, getLanguageLocaleWORegion } from '../src/helpers/i18n-utils';
import { getUILangFromPath } from '../src/helpers/url';
import { absoluteUrl, canonicalPath } from '../src/helpers/seo';
import { isNotFoundError } from '../src/helpers/errors';
import { backendApi } from '../src/redux/api/backendApi';
import { wholeMusic } from '../src/redux/api/music';
import { wholeSimpleMode } from '../src/redux/api/simpleMode';
import { createStore } from '../src/redux/createStore';
import {
  onSetUrlLanguage,
  actions as settings,
  initialState as settingsInitialState,
} from '../src/redux/modules/settings';
import { actions as ssr } from '../src/redux/modules/ssr';
import { fetchSQData } from '../src/sagas/mdb';
import buildRoutes from '../src/route/routes';

const initializeI18nBackend = async uiLang => {
  // eslint-disable-next-line import/no-named-as-default-member -- named export is unbound
  const i18n = i18next.createInstance();
  await i18n.use(i18nextBackend).init({
    ...options,
    preload: ['en', 'he', 'ru', 'es'],
    backend: {
      loadPath: path.resolve(process.cwd(), 'public/locales/{{lng}}/{{ns}}.json'),
    },
    lng: uiLang,
  });
  registerDateFormats(i18n);
  return i18n;
};

export const NAMESPACE = 'serverRender';
export const BASE_URL = process.env.REACT_APP_BASE_URL;

const _Empty = () => null;

// Lightweight per-request SSR phase timer. Logs an absolute start timestamp plus per-phase
// deltas (and a running total) so we can see which stage — i18n init, data fetch, React
// render — dominates SSR latency on staging/prod.
const createSSRTimer = label => {
  const start = Date.now();
  let last = start;
  logger.info(NAMESPACE, `[timing] ${new Date(start).toISOString()} START ${label}`);
  return {
    mark: step => {
      const now = Date.now();
      logger.info(NAMESPACE, `[timing] ${label} | ${step}: +${now - last}ms (total ${now - start}ms)`);
      last = now;
    },
  };
};

function renderToBuffer(element) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const writable = new PassThrough();
    writable.on('data', chunk => chunks.push(chunk));
    writable.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    writable.on('error', reject);

    const { pipe } = renderToPipeableStream(element, {
      onAllReady() {
        pipe(writable);
      },
      onError: reject,
      // Everything is ready before piping, so inline every Suspense boundary.
      // With the default (~12.8KB) React outlines big boundaries into <div hidden id="S:0">
      // and moves them with an inline script — no-JS crawlers, link previews and
      // browser reader mode then see an empty page.
      progressiveChunkSize: Number.MAX_SAFE_INTEGER,
    });
  });
}

function pipeToResponse(element, res, suffix) {
  return new Promise((resolve, reject) => {
    const pt = new PassThrough();
    pt.on('data', chunk => res.write(chunk));
    pt.on('end', () => {
      res.write(suffix);
      res.end();
      resolve();
    });
    pt.on('error', reject);

    const { pipe } = renderToPipeableStream(element, {
      onShellReady() {
        pipe(pt);
      },
      onShellError: reject,
      onError(error) {
        logger.error(NAMESPACE, 'stream render error', error);
      },
    });
  });
}

const htmlDir = process.env.NODE_ENV === 'production' ? 'build' : '.';
export const htmlData = fs.readFileSync(path.resolve(process.cwd(), htmlDir, 'index.html'), 'utf8');

export const getPromises = (store, originalUrl, { route, params }) => {
  logger.log(NAMESPACE, 'libraryPage source was found', route.ssrData?.name);
  return route.ssrData
    ? route.ssrData(
      store,
      {
        params,
        parsedURL: new URL(originalUrl, 'https://example.com'),
      },
      true
    )
    : Promise.resolve(null);
};

// Waits for all SSR data loaders. Returns true when one reported a missing entity (NotFoundError);
// any other failure is rethrown (-> 500).
const awaitDataPromises = async promises => {
  const results  = await Promise.allSettled(promises);
  const failures = results.filter(r => r.status === 'rejected').map(r => r.reason);
  const fatal    = failures.find(e => !isNotFoundError(e));
  if (fatal) {
    logger.error(NAMESPACE, 'SSR promises error', fatal);
    throw fatal;
  }

  logger.info(NAMESPACE, 'RTK queries prepared', failures.length ? '(not found)' : '');
  return failures.length > 0;
};

export const prepareDeviceInfo = req => getDeviceInfo(req.get('user-agent'));

// Full SSR pipeline shared by bot and auth renderers.
// extraInitialState is merged into the Redux initial state (e.g. { auth: { user: { name: KC_BOT_USER_NAME } } }).
export async function renderSSR(req, extraInitialState = {}) {
  const t = createSSRTimer(`renderSSR ${req.originalUrl}`);
  const { language: uiLang } = getUILangFromPath(req.originalUrl, req.headers, req.get('user-agent'));

  setDayjsLocale(uiLang);

  let i18nServer;
  try {
    i18nServer = await initializeI18nBackend(uiLang);
  } catch (error) {
    logger.error(NAMESPACE, 'Error initializing i18n backend', error);
    throw error;
  }

  t.mark('i18n init');

  const history = createMemoryHistory({ initialEntries: [req.originalUrl] });
  const cookies = cookieParse(req.headers.cookie || '');

  const cookieUILang = cookies[COOKIE_UI_LANG] || uiLang;
  let cookieContentLanguages = cookies[COOKIE_CONTENT_LANGS] || [uiLang];
  if (typeof cookieContentLanguages === 'string' || cookieContentLanguages instanceof String) {
    cookieContentLanguages = cookieContentLanguages.split(',');
  }

  const initialState = {
    settings: {
      ...settingsInitialState,
      urlLanguage: [uiLang],
      showAllContent: cookies[COOKIE_SHOW_ALL_CONTENT] === 'true' || false,
    },
    ...extraInitialState,
  };

  const store = createStore(initialState, history);

  logger.info(NAMESPACE, 'dispatching languages change', cookieUILang, cookieContentLanguages);
  store.dispatch(settings.setUILanguage({ uiLang: cookieUILang }));
  store.dispatch(settings.setContentLanguages({ contentLanguages: cookieContentLanguages }));
  store.dispatch(backendApi.util.invalidateTags([wholeSimpleMode, wholeMusic]));
  t.mark('store + lang dispatch');

  const routes = buildRoutes(_Empty).map(r => ({ ...r, path: `${uiLang}/${r.path}` }));
  const reqPath = req.originalUrl.split('?')[0];
  const branch = matchRoutes(routes, reqPath) || [];

  logger.info(NAMESPACE, 'prepare RTK queries');
  const promises = branch.map(b => getPromises(store, req.originalUrl, b));
  const rtkPromises = store.dispatch(backendApi.util.getRunningQueriesThunk());
  logger.log(NAMESPACE, 'promises %d, RTK promises %d', promises.length, rtkPromises.length);
  rtkPromises.forEach(promise => promises.push(promise));
  // Global sources/tags/publishers/persons — awaited so it lands in window.__data.
  promises.push(store.sagaMiddleWare.run(fetchSQData).toPromise());
  t.mark(`dispatch data fetches (${promises.length})`);

  // A missing entity (NotFoundError) still renders the page, but with HTTP 404; the catch-all route is a 404 too.
  let status = branch.some(b => b.route.notFound) ? 404 : 200;
  if (await awaitDataPromises(promises)) status = 404;
  t.mark('await data fetches');

  try {
    await store.rootSagaPromise;
    logger.info(NAMESPACE, 'root saga prepared');
  } catch (error) {
    logger.error(NAMESPACE, 'Root saga error', error);
    throw error;
  }

  t.mark('root saga');

  const deviceInfo = prepareDeviceInfo(req);
  const helmetContext = {};

  logger.info(NAMESPACE, 'renderToPipeableStream start');
  const markup = await renderToBuffer(
    <AppServer i18n={i18nServer} store={store} history={history} deviceInfo={deviceInfo} helmetContext={helmetContext} />
  );
  t.mark('react render (renderToBuffer)');

  const { helmet } = helmetContext;
  const direction = getLanguageDirection(uiLang);

  const i18nData = serialize({
    initialLanguage: i18nServer.language,
    initialI18nStore: pick(i18nServer.services.resourceStore.data, [
      i18nServer.language,
      i18nServer.options.fallbackLng,
    ]),
  });

  store.dispatch(ssr.prepare());
  const storeData = store.getState();
  const storeDataStr = serialize(storeData);
  logger.log(NAMESPACE, 'redux data before return', storeData.auth);

  const rootDiv = `
    <div id="root">${markup}</div>
    <script>
      window.__botKCInfo = ${storeData.auth?.user?.name === KC_BOT_USER_NAME ? serialize(storeData.auth) : false};
      window.__data = ${storeDataStr};
      window.__i18n = ${i18nData};
    </script>
  `;

  const html = htmlData
    .replace(/<html lang="en" translate="no">/, `<html lang="${uiLang}" dir="${direction}" translate="no" ${helmet.htmlAttributes.toString()}>`)
    .replace(/<title>.*<\/title>/, helmet.title.toString())
    .replace(
      /<\/head>/,
      `${helmet.meta.toString()}${helmet.link.toString()}${helmet.script.toString()}${canonicalLink(req, uiLang)}${alternateLinks(req, uiLang)}${ogUrl(req, uiLang)}</head>`
    )
    .replace(/<body>/, `<body ${helmet.bodyAttributes.toString()}>`)
    .replace(/<div id="root"><\/div>/, rootDiv);

  t.mark('html assembly + serialize');
  logger.log(NAMESPACE, 'rendered html');
  return { html, status };
}

// Streaming SSR: sends <head> (CSS) immediately, fetches data, then streams body.
// Used for authenticated users. Bots still use blocking renderSSR.
export async function renderSSRStream(req, res, extraInitialState = {}) {
  const t = createSSRTimer(`renderSSRStream ${req.originalUrl}`);
  const { language: uiLang } = getUILangFromPath(req.originalUrl, req.headers, req.get('user-agent'));
  setDayjsLocale(uiLang);
  const direction = getLanguageDirection(uiLang);

  // Phase 1: flush <head> so the browser starts loading CSS immediately
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  const headCloseIdx = htmlData.indexOf('</head>');
  const headHtml = `${htmlData
    .slice(0, headCloseIdx)
    .replace('<html lang="en">', `<html lang="${uiLang}" dir="${direction}">`)
    + canonicalLink(req, uiLang)
    + alternateLinks(req, uiLang)
    + ogUrl(req, uiLang)
     }</head>`;

  res.write(headHtml);
  res.write('<body>');
  t.mark('head flushed');

  // Phase 2: init i18n + store + fetch data (CSS loading in browser in parallel)
  let i18nServer;
  try {
    i18nServer = await initializeI18nBackend(uiLang);
  } catch (error) {
    logger.error(NAMESPACE, 'Error initializing i18n backend', error);
    throw error;
  }

  t.mark('i18n init');

  const history = createMemoryHistory({ initialEntries: [req.originalUrl] });
  const cookies = cookieParse(req.headers.cookie || '');

  const cookieUILang = cookies[COOKIE_UI_LANG] || uiLang;
  let cookieContentLanguages = cookies[COOKIE_CONTENT_LANGS] || [uiLang];
  if (typeof cookieContentLanguages === 'string' || cookieContentLanguages instanceof String) {
    cookieContentLanguages = cookieContentLanguages.split(',');
  }

  const initialState = {
    settings: {
      ...settingsInitialState,
      showAllContent: cookies[COOKIE_SHOW_ALL_CONTENT] === 'true' || false,
    },
    ...extraInitialState,
  };
  if (uiLang !== cookieUILang) {
    onSetUrlLanguage(initialState.settings, uiLang);
  }

  const store = createStore(initialState, history);
  logger.info(NAMESPACE, 'dispatching languages change', cookieUILang, cookieContentLanguages);
  store.dispatch(settings.setUILanguage({ uiLang: cookieUILang }));
  store.dispatch(settings.setContentLanguages({ contentLanguages: cookieContentLanguages }));
  store.dispatch(backendApi.util.invalidateTags([wholeSimpleMode, wholeMusic]));
  t.mark('store + lang dispatch');

  const routes = buildRoutes(_Empty).map(r => ({ ...r, path: `${uiLang}/${r.path}` }));
  const reqPath = req.originalUrl.split('?')[0];
  const branch = matchRoutes(routes, reqPath) || [];

  logger.info(NAMESPACE, 'prepare RTK queries');
  const promises = branch.map(b => getPromises(store, req.originalUrl, b));
  const rtkPromises = store.dispatch(backendApi.util.getRunningQueriesThunk());
  rtkPromises.forEach(promise => promises.push(promise));
  // Global sources/tags/publishers/persons — awaited so it lands in window.__data.
  promises.push(store.sagaMiddleWare.run(fetchSQData).toPromise());
  t.mark(`dispatch data fetches (${promises.length})`);

  // Headers are already sent: a missing entity can't change the status here, just keep rendering.
  await awaitDataPromises(promises);
  t.mark('await data fetches');

  try {
    await store.rootSagaPromise;
    logger.info(NAMESPACE, 'root saga prepared');
  } catch (error) {
    logger.error(NAMESPACE, 'Root saga error', error);
    throw error;
  }

  t.mark('root saga');

  // Phase 3: serialize store + i18n for client hydration
  const i18nData = serialize({
    initialLanguage: i18nServer.language,
    initialI18nStore: pick(i18nServer.services.resourceStore.data, [
      i18nServer.language,
      i18nServer.options.fallbackLng,
    ]),
  });

  store.dispatch(ssr.prepare());
  const storeData = store.getState();
  const storeDataStr = serialize(storeData);
  logger.log(NAMESPACE, 'redux data before stream', storeData.auth);

  const deviceInfo = prepareDeviceInfo(req);
  const helmetContext = {};

  const suffix =
    `</div>` +
    `<script>` +
    `window.__botKCInfo=${false};` +
    `window.__data=${storeDataStr};` +
    `window.__i18n=${i18nData};` +
    `</script>` +
    `</body></html>`;

  // Phase 4: stream React body into the open response
  t.mark('serialize + pre-stream');
  logger.info(NAMESPACE, 'renderToPipeableStream stream start');
  res.write(`<div id="root" class="${direction}" style="direction: ${direction}">`);

  return pipeToResponse(
    <AppServer i18n={i18nServer} store={store} history={history} deviceInfo={deviceInfo} helmetContext={helmetContext} />,
    res,
    suffix
  ).then(result => {
    t.mark('react stream complete');
    return result;
  });
}

// canonical, og:url and hreflang are all built from the same canonicalPath() so they always agree.
const escapeAttr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Self-referencing canonical: each language version is its own page (tied together by hreflang).
// see https://yoast.com/rel-canonical/
export function canonicalLink(req, lang) {
  return `<link rel="canonical" href="${escapeAttr(absoluteUrl(lang, canonicalPath(req.originalUrl, lang)))}" />`;
}

// see https://yoast.com/hreflang-ultimate-guide/
export function alternateLinks(req, lang) {
  const cPath = canonicalPath(req.originalUrl, lang);
  return `${LANG_UI_LANGUAGES.map(x => {
    const l = getLanguageLocaleWORegion(x);
    return `<link rel="alternate" href="${escapeAttr(absoluteUrl(x, cPath))}" hreflang="${l}" />`;
  }).join('')  }<link rel="alternate" href="${escapeAttr(absoluteUrl('', cPath))}" hreflang="x-default" />`;
}

export function ogUrl(req, lang) {
  return `<meta property="og:url" content="${escapeAttr(absoluteUrl(lang, canonicalPath(req.originalUrl, lang)))}" />`;
}

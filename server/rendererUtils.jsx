import { parse as cookieParse } from 'cookie';
import fs from 'fs';
import { createMemoryHistory } from 'history';
import pick from 'lodash/pick';
import moment from 'moment/moment';
import path from 'path';
import { PassThrough } from 'stream';
import qs from 'qs';
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { matchRoutes } from 'react-router-dom';
import serialize from 'serialize-javascript';
import * as pkgUaParserJs from 'ua-parser-js';
import { URL } from 'url';
import { AppServer } from '../src/components/App/AppServer';
import logger from '../src/logger/logger';
import i18next from 'i18next';
import i18nextBackend from 'i18next-fs-backend';
import { options, registerMomentFormats } from '../src/helpers/i18nnext';
import {
  COOKIE_CONTENT_LANGS,
  COOKIE_SHOW_ALL_CONTENT,
  COOKIE_UI_LANG,
  KC_BOT_USER_NAME,
  LANG_UI_LANGUAGES,
  LANG_UKRAINIAN,
} from '../src/helpers/consts';
import { getLanguageDirection, getLanguageLocaleWORegion } from '../src/helpers/i18n-utils';
import { getUILangFromPath } from '../src/helpers/url';
import { isEmpty } from '../src/helpers/utils';
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
import buildRoutes from '../src/route/routes';

const { UAParser } = pkgUaParserJs;

const initializeI18nBackend = async uiLang => {
  const i18n = i18next.createInstance();
  await i18n.use(i18nextBackend).init({
    ...options,
    preload: ['en', 'he', 'ru', 'es'],
    backend: {
      loadPath: path.resolve(process.cwd(), 'public/locales/{{lng}}/{{ns}}.json'),
    },
    lng: uiLang,
  });
  registerMomentFormats(i18n);
  return i18n;
};

export const NAMESPACE = 'serverRender';
export const BASE_URL = process.env.REACT_APP_BASE_URL;

const _Empty = () => null;

function renderToBuffer(element) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const writable = new PassThrough();
    writable.on('data', chunk => chunks.push(chunk));
    writable.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    writable.on('error', reject);

    const { pipe } = renderToPipeableStream(element, {
      onAllReady() { pipe(writable); },
      onError: reject,
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
      onShellReady() { pipe(pt); },
      onShellError: reject,
      onError(error) { logger.error(NAMESPACE, 'stream render error', error); },
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

export const prepareDeviceInfo = req => {
  const ua = new UAParser(req.get('user-agent'));
  const device = ua.getDevice();
  const os = ua.getOS();
  return {
    isIOS: os.is('iOS'),
    isAndroid: os.is('Android'),
    deviceType: device?.type || 'desktop',
    browserName: ua.getBrowser().name,
    isMobile: device.is('mobile'),
    isIPhone: device.is('iPhone') || device.is('iPhone Simulator'),
  };
};

// Full SSR pipeline shared by bot and auth renderers.
// extraInitialState is merged into the Redux initial state (e.g. { auth: { user: { name: KC_BOT_USER_NAME } } }).
export async function renderSSR(req, extraInitialState = {}) {
  const { language: uiLang } = getUILangFromPath(req.originalUrl, req.headers, req.get('user-agent'));

  moment.locale(uiLang === LANG_UKRAINIAN ? 'uk' : uiLang);

  let i18nServer;
  try {
    i18nServer = await initializeI18nBackend(uiLang);
  } catch (error) {
    logger.error(NAMESPACE, 'Error initializing i18n backend', error);
    throw error;
  }

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

  const routes = buildRoutes(_Empty).map(r => ({ ...r, path: `${uiLang}/${r.path}` }));
  const reqPath = req.originalUrl.split('?')[0];
  const branch = matchRoutes(routes, reqPath) || [];

  logger.info(NAMESPACE, 'prepare RTK queries');
  const promises = branch.map(b => getPromises(store, req.originalUrl, b));
  const rtkPromises = store.dispatch(backendApi.util.getRunningQueriesThunk());
  logger.log(NAMESPACE, 'promises %d, RTK promises %d', promises.length, rtkPromises.length);
  rtkPromises.forEach(promise => promises.push(promise));

  try {
    await Promise.all(promises);
    logger.info(NAMESPACE, 'RTK queries prepared');
  } catch (error) {
    logger.error(NAMESPACE, 'SSR promises error', error);
    throw error;
  }

  try {
    await store.rootSagaPromise;
    logger.info(NAMESPACE, 'root saga prepared');
  } catch (error) {
    logger.error(NAMESPACE, 'Root saga error', error);
    throw error;
  }

  const deviceInfo = prepareDeviceInfo(req);
  const helmetContext = {};

  logger.info(NAMESPACE, 'renderToPipeableStream start');
  const markup = await renderToBuffer(
    <AppServer i18n={i18nServer} store={store} history={history} deviceInfo={deviceInfo} helmetContext={helmetContext} />
  );
  logger.info(NAMESPACE, 'renderToPipeableStream end', helmetContext);

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
      `${helmet.meta.toString()}${helmet.link.toString()}${canonicalLink(req, uiLang)}${alternateLinks(req, uiLang)}${ogUrl(req, uiLang)}</head>`
    )
    .replace(/<body>/, `<body ${helmet.bodyAttributes.toString()}>`)
    .replace(/<div id="root"><\/div>/, rootDiv);

  logger.log(NAMESPACE, 'rendered html');
  return html;
}

// Streaming SSR: sends <head> (CSS) immediately, fetches data, then streams body.
// Used for authenticated users. Bots still use blocking renderSSR.
export async function renderSSRStream(req, res, extraInitialState = {}) {
  const { language: uiLang } = getUILangFromPath(req.originalUrl, req.headers, req.get('user-agent'));
  console.log('[rendererUtils stream] before moment.locale(), locales:', moment.locales(), 'setting to:', uiLang);
  moment.locale(uiLang === LANG_UKRAINIAN ? 'uk' : uiLang);
  console.log('[rendererUtils stream] after moment.locale(), global locale:', moment.locale());
  const direction = getLanguageDirection(uiLang);

  // Phase 1: flush <head> so the browser starts loading CSS immediately
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  const headCloseIdx = htmlData.indexOf('</head>');
  const headHtml =
    htmlData
      .slice(0, headCloseIdx)
      .replace('<html lang="en">', `<html lang="${uiLang}" dir="${direction}">`)
    + canonicalLink(req, uiLang)
    + alternateLinks(req, uiLang)
    + ogUrl(req, uiLang)
    + '</head>';

  res.write(headHtml);
  res.write('<body>');

  // Phase 2: init i18n + store + fetch data (CSS loading in browser in parallel)
  let i18nServer;
  try {
    i18nServer = await initializeI18nBackend(uiLang);
  } catch (error) {
    logger.error(NAMESPACE, 'Error initializing i18n backend', error);
    throw error;
  }

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

  const routes = buildRoutes(_Empty).map(r => ({ ...r, path: `${uiLang}/${r.path}` }));
  const reqPath = req.originalUrl.split('?')[0];
  const branch = matchRoutes(routes, reqPath) || [];

  logger.info(NAMESPACE, 'prepare RTK queries');
  const promises = branch.map(b => getPromises(store, req.originalUrl, b));
  const rtkPromises = store.dispatch(backendApi.util.getRunningQueriesThunk());
  rtkPromises.forEach(promise => promises.push(promise));

  try {
    await Promise.all(promises);
    logger.info(NAMESPACE, 'RTK queries prepared');
  } catch (error) {
    logger.error(NAMESPACE, 'SSR promises error', error);
    throw error;
  }

  try {
    await store.rootSagaPromise;
    logger.info(NAMESPACE, 'root saga prepared');
  } catch (error) {
    logger.error(NAMESPACE, 'Root saga error', error);
    throw error;
  }

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
  logger.info(NAMESPACE, 'renderToPipeableStream stream start');
  res.write(`<div id="root" class="${direction}" style="direction: ${direction}">`);

  return pipeToResponse(
    <AppServer i18n={i18nServer} store={store} history={history} deviceInfo={deviceInfo} helmetContext={helmetContext} />,
    res,
    suffix
  );
}

// see https://yoast.com/rel-canonical/
export function canonicalLink(req, lang) {
  let cPath = req.originalUrl;
  if (lang && cPath.startsWith(`/${lang}`)) {
    cPath = cPath.substring(3);
  }

  const s = cPath.split('?');
  cPath = s[0];

  if (cPath.startsWith('/')) {
    cPath = cPath.substring(1);
  }
  if (cPath.endsWith('/')) {
    cPath = cPath.substring(0, cPath.length - 1);
  }

  if (s.length > 1) {
    const q = qs.parse(s[1]);
    delete q.sstart;
    delete q.send;
    delete q.language;
    delete q.ap;
    if (!isEmpty(q)) {
      cPath = `${cPath}?${qs.stringify(q)}`;
    }
  }

  if (/\/gr-/.test(cPath)) {
    const result = /(.+)\/gr-(.+)$/.exec(cPath);
    cPath = `${result[1]}/${result[2]}`;
  }

  return `<link rel="canonical" href="${BASE_URL}${cPath}" />`;
}

// see https://yoast.com/hreflang-ultimate-guide/
export function alternateLinks(req, lang) {
  let aPath = req.originalUrl;
  if (lang && aPath.startsWith(`/${lang}`)) {
    aPath = aPath.substring(3);
  }
  if (aPath.startsWith('/')) {
    aPath = aPath.substring(1);
  }
  return LANG_UI_LANGUAGES.map(x => {
    const l = getLanguageLocaleWORegion(x);
    return `<link rel="alternate" href="${BASE_URL}${x}/${aPath}" hreflang="${l}" />`;
  }).join('');
}

export function ogUrl(req, lang) {
  let aPath = req.originalUrl;
  if (lang && aPath.startsWith(`/${lang}`)) {
    aPath = aPath.substring(3);
  }
  if (aPath.startsWith('/')) {
    aPath = aPath.substring(1);
  }
  return `<meta property="og:url" content="${BASE_URL}${lang}/${aPath}" />`;
}

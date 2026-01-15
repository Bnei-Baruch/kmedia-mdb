import { parse as cookieParse } from "cookie";
import fs from "fs";
import { createMemoryHistory } from "history";
import pick from "lodash/pick";
import moment from "moment/moment";
import { fileURLToPath } from "node:url";
import path from "path";
import qs from "qs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { matchRoutes } from "react-router-dom";
import serialize from "serialize-javascript";
import * as pkgUaParserJs from "ua-parser-js";
import { URL } from "url";
import { AppServer } from "../src/components/App/AppServer";
import logger from "../src/logger/logger";



import { initializeI18nBackend } from "../src/helpers/i18nnext";

const { UAParser } = pkgUaParserJs;

import {
  COOKIE_CONTENT_LANGS,
  COOKIE_SHOW_ALL_CONTENT,
  COOKIE_UI_LANG,
  KC_BOT_USER_NAME,
  LANG_UI_LANGUAGES,
  LANG_UKRAINIAN,
} from "../src/helpers/consts";
import { getLanguageDirection, getLanguageLocaleWORegion } from "../src/helpers/i18n-utils";
import { getUILangFromPath } from "../src/helpers/url";
import { isEmpty } from "../src/helpers/utils";
import { backendApi } from "../src/redux/api/backendApi";
import { wholeMusic } from "../src/redux/api/music";
import { wholeSimpleMode } from "../src/redux/api/simpleMode";
import { createStore } from "../src/redux/createStore";
import {
  onSetUrlLanguage,
  actions as settings,
  initialState as settingsInitialState
} from "../src/redux/modules/settings";
import { actions as ssr } from "../src/redux/modules/ssr";
import buildRoutes from "../src/route/routes";

const _Empty = () => null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const helmetContext = {};

const BASE_URL = process.env.REACT_APP_BASE_URL;

const getPromises = (store, originalUrl, show_console, { route, params }) => {
  logger.log("serverRender: libraryPage source was found", route.ssrData?.name);
  return route.ssrData
    ? route.ssrData(
        store,
        {
          params,
          parsedURL: new URL(originalUrl, "https://example.com"),
        },
        show_console
      )
    : Promise.resolve(null);
};

const htmlData = fs.readFileSync(path.resolve(__dirname, "..", "build", "critical.html"), "utf8");

export async function render(req) {
  const { language: uiLang } = getUILangFromPath(req.originalUrl, req.headers, req.get("user-agent"));

  moment.locale(uiLang === LANG_UKRAINIAN ? "uk" : uiLang);
  let i18nServer;
  try {
    i18nServer = await initializeI18nBackend(uiLang);
  } catch (error) {
    logger.error("Error initializing i18n backend", error);
    throw error;
  }

  const history = createMemoryHistory({
    initialEntries: [req.originalUrl],
  });

  const cookies = cookieParse(req.headers.cookie || "");

  const cookieUILang = cookies[COOKIE_UI_LANG] || uiLang;
  let cookieContentLanguages = cookies[COOKIE_CONTENT_LANGS] || [uiLang];
  if (typeof cookieContentLanguages === "string" || cookieContentLanguages instanceof String) {
    cookieContentLanguages = cookieContentLanguages.split(",");
  }

  const initialState = {
    settings: {
      ...settingsInitialState,
      showAllContent: cookies[COOKIE_SHOW_ALL_CONTENT] === "true" || false,
    },
  };
  if (uiLang !== cookieUILang) {
    onSetUrlLanguage(initialState.settings, uiLang);
  }

  const store = createStore(initialState, history);

  // Dispatching languages change updates tags and sources.
  logger.info("serverRender: dispatching languages change", cookieUILang, cookieContentLanguages);
  store.dispatch(settings.setUILanguage({ uiLang: cookieUILang }));
  store.dispatch(settings.setContentLanguages({contentLanguages: cookieContentLanguages}));
  store.dispatch(backendApi.util.invalidateTags([wholeSimpleMode, wholeMusic]));

  const routes = buildRoutes(_Empty).map((r) => ({ ...r, path: `${uiLang}/${r.path}` }));
  const reqPath = req.originalUrl.split("?")[0];
  const branch = matchRoutes(routes, reqPath) || [];

  logger.info("serverRender: prepare RTK queries");
  const promises = branch.map((b) => getPromises(store, req.originalUrl, b));
  const rtkPromises = store.dispatch(backendApi.util.getRunningQueriesThunk());
  logger.log("serverRender: promises %d, RTK promises %d", promises.length, rtkPromises.length);
  rtkPromises.forEach((promise) => promises.push(promise));

  try {
    await Promise.all(promises);
    logger.info("serverRender: RTK queries prepared");
  } catch (error) {
    logger.error("SSR promises error", error);
    throw error;
  }

  try {
    await store.rootSagaPromise;
    logger.info("serverRender: root saga prepared");
  } catch (error) {
    logger.error("Root saga error", error);
    throw error;
  }

  const deviceInfo = prepareDeviceInfo(req);

  logger.info("serverRender: renderToString start");
  const markup = ReactDOMServer.renderToString(
    <AppServer i18n={i18nServer} store={store} history={history} deviceInfo={deviceInfo} />
  );

  logger.info("serverRender: renderToString end");
  const { helmet } = helmetContext;

  // We're good, add in markup, send the response.
  const direction = getLanguageDirection(uiLang);
  const cssDirection = direction === "ltr" ? "" : ".rtl";

  const i18nData = serialize({
    initialLanguage: i18nServer.language,
    initialI18nStore: pick(i18nServer.services.resourceStore.data, [
      i18nServer.language,
      i18nServer.options.fallbackLng,
    ]),
  });

  store.dispatch(ssr.prepare());
  // console.log(require('util').inspect(store.getState(), { showHidden: true, depth: 2 }));
  const storeData = store.getState();
  const storeDataStr = serialize(storeData);
  logger.log("serverRender: redux data before return", storeData.auth);
  const rootDiv = `
                <div id="root" class="${direction}" style="direction: ${direction}">${markup}</div>
                <script>
                  window.__botKCInfo = ${
                    storeData.auth?.user?.name === KC_BOT_USER_NAME ? serialize(storeData.auth) : false
                  };
                  window.__data = ${storeDataStr};
                  window.__i18n = ${i18nData};
                </script>
                `;

  const html = htmlData
    /*.replace(/<html lang="en">/, `<html lang="en" ${helmet.htmlAttributes.toString()} >`)
    .replace(/lang="en"/, `lang="${uiLang}"`)
    .replace(/<title>.*<\/title>/, helmet.title.toString())
    .replace(
      /<\/head>/,
      `${helmet.meta.toString()}${helmet.link.toString()}${canonicalLink(req, uiLang)}${alternateLinks(
        req,
        uiLang
      )}${ogUrl(req, uiLang)}</head>`
    )
    .replace(/<body>/, `<body ${helmet.bodyAttributes.toString()} >`)
    .replace(/semantic_v4.min.css/g, `semantic_v4${cssDirection}.min.css`)
    */
    .replace(/<div id="root"><\/div>/, rootDiv);

  logger.log("serverRender: rendered html", html);
  /*
  if (context.code) {
    res.status(context.code);
  }
*/
  //return res.send(html);
  return html;
}

// see https://yoast.com/rel-canonical/
function canonicalLink(req, lang) {
  // strip ui language from path
  let cPath = req.originalUrl;
  if (lang && cPath.startsWith(`/${lang}`)) {
    cPath = cPath.substring(3);
  }

  const s = cPath.split("?");

  // start with path part
  cPath = s[0];

  // strip leading slash as it comes from BASE_URL
  if (cPath.startsWith("/")) {
    cPath = cPath.substring(1);
  }

  // strip trailing slash as we don't use those
  if (cPath.endsWith("/")) {
    cPath = cPath.substring(0, cPath.length - 1);
  }

  // clean content invariant keys from search part (query)
  if (s.length > 1) {
    const q = qs.parse(s[1]);
    delete q.sstart; // player slice start
    delete q.send; // player slice end
    delete q.language; // content language

    // This one is conceptually wrong.
    // As changing the active part in a playlist would most definitely
    // change the page's content.
    // Most of the content would seem to duplicate the CU page.
    // However, it's logically not easy and some units may not
    // have their own CU page so we skip it.
    delete q.ap; // playlist active part

    if (!isEmpty(q)) {
      cPath = `${cPath}?${qs.stringify(q)}`;
    }
  }

  if (/\/gr-/.test(cPath)) {
    // Rabash Group Articles
    const result = /(.+)\/gr-(.+)$/.exec(cPath);
    cPath = `${result[1]}/${result[2]}`;
  }

  return `<link rel="canonical" href="${BASE_URL}${cPath}" />`;
}

// see https://yoast.com/hreflang-ultimate-guide/
function alternateLinks(req, lang) {
  // strip ui language from path
  let aPath = req.originalUrl;
  if (lang && aPath.startsWith(`/${lang}`)) {
    aPath = aPath.substring(3);
  }

  // strip leading slash as it comes from BASE_URL
  if (aPath.startsWith("/")) {
    aPath = aPath.substring(1);
  }

  return LANG_UI_LANGUAGES.map((x) => {
    const l = getLanguageLocaleWORegion(x);
    return `<link rel="alternate" href="${BASE_URL}${x}/${aPath}" hreflang="${l}" />`;
  }).join("");
}

function ogUrl(req, lang) {
  // strip ui language from path
  let aPath = req.originalUrl;
  if (lang && aPath.startsWith(`/${lang}`)) {
    aPath = aPath.substring(3);
  }

  // strip leading slash as it comes from BASE_URL
  if (aPath.startsWith("/")) {
    aPath = aPath.substring(1);
  }

  return `<meta property="og:url" content="${BASE_URL}${lang}/${aPath}" />`;
}

const prepareDeviceInfo = (req) => {
  const ua = new UAParser(req.get("user-agent"));
  const device = ua.getDevice();
  const os = ua.getOS();

  return {
    isIOS: os.is("iOS"),
    isAndroid: os.is("Android"),
    deviceType: device?.type || "desktop",
    browserName: ua.getBrowser().name,
    isMobile: device.is("mobile"),
    isIPhone: device.is("iPhone") || device.is("iPhone Simulator"),
  };
};

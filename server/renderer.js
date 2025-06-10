import React from 'react';
import { URL } from 'url';
import ReactDOMServer from 'react-dom/server';
import { matchRoutes } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import qs from 'qs';
import serialize from 'serialize-javascript';
import localStorage from 'mock-local-storage';
import { parse as cookieParse } from 'cookie';
import crawlers from 'crawler-user-agents';
import UAParser from 'ua-parser-js';

import useRoutes from '../src/route/routes';
import {
  COOKIE_UI_LANG,
  COOKIE_CONTENT_LANGS,
  COOKIE_SHOW_ALL_CONTENT,
  LANG_UI_LANGUAGES,
  LANG_UKRAINIAN,
  KC_BOT_USER_NAME
} from '../src/helpers/consts';
import { getLanguageLocaleWORegion, getLanguageDirection } from '../src/helpers/i18n-utils';
import { getUILangFromPath } from '../src/helpers/url';
import { isEmpty } from '../src/helpers/utils';
import createStore from '../src/redux/createStore';
import { actions as ssr } from '../src/redux/modules/ssr';
import {
  actions as settings,
  initialState as settingsInitialState,
  onSetUILanguage,
  onSetContentLanguages,
  onSetUrlLanguage
} from '../src/redux/modules/settings';
import i18nnext from './i18nnext';
import App from '../src/components/App/App';
import moment from 'moment/moment';
import { pick } from 'lodash/object';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from '../src/components/ErrorBoundary';
import { backendApi } from '../src/redux/api/backendApi';
import { wholeSimpleMode } from '../src/redux/api/simpleMode';
import { wholeMusic } from '../src/redux/api/music';

const helmetContext = {};

// eslint-disable-next-line no-unused-vars
const DoNotRemove = localStorage; // DO NOT REMOVE - the import above does all the work

const BASE_URL     = process.env.REACT_APP_BASE_URL;
const KC_API_URL   = process.env.REACT_KC_API_URL;
const KC_REALM     = process.env.REACT_KC_REALM;
const KC_CLIENT_ID = process.env.REACT_KC_CLIENT_ID;

const windowEnvVariables = () => {
  const vars = [];
  if (KC_API_URL) {
    vars.push(`window.KC_API_URL = '${KC_API_URL}';`);
  }

  if (KC_REALM) {
    vars.push(`window.KC_REALM = '${KC_REALM}';`);
  }

  if (KC_CLIENT_ID) {
    vars.push(`window.KC_CLIENT_ID = '${KC_CLIENT_ID}';`);
  }

  return vars.join('');
};

let show_console = false;
export default function serverRender(req, res, next, htmlData) {
  if (req.originalUrl.includes('anonymous')) return;

  show_console = req.originalUrl.includes('ssr_debug');
  show_console && console.log('serverRender', req.originalUrl);
  show_console && console.log('headers', req.headers);

  const { language: uiLang, redirect } = getUILangFromPath(req.originalUrl, req.headers, req.get('user-agent'));
  show_console && console.log('getUILangFromPath', uiLang, redirect);
  if (redirect) {
    const newUrl = `${BASE_URL}${uiLang}${req.originalUrl}`;
    show_console && console.log(`serverRender: redirect (${uiLang}) => ${newUrl}`);
    res.writeHead(307, { Location: newUrl });
    res.end();
    return;
  }

  const cookies = cookieParse(req.headers.cookie || '');
  const bot     = isBot(req) || !!req.query.embed;

  show_console && console.log('serverRender: isbot', bot, req.headers['user-agent']);
  if (cookies['authorised'] || req.query.authorised || bot) {
    serverRenderAuthorised(req, res, next, htmlData, uiLang, bot);
    return;
  }

  serverRenderSSOAuth(req, res, next, htmlData);
}

function serverRenderSSOAuth(req, res, next, htmlData) {
  show_console && console.log('serverRender: AuthApp server render');
  const rootDiv = `
    <div id="root"></div>
    <script>
      ${windowEnvVariables()}
    </script>
  `;

  const html = htmlData
    .replace(/<div id="root"><\/div>/, rootDiv);
  res.send(html);
}

const getPromises = (store, originalUrl, cookieUILang, cookieContentLanguages, show_console, { route, params }) => {
  show_console && console.log('serverRender: libraryPage source was found', route.ssrData?.name);
  return route.ssrData
    ? route.ssrData(
      store, {
        params,
        parsedURL       : new URL(originalUrl, 'https://example.com'),
        uiLang          : cookieUILang,
        contentLanguages: cookieContentLanguages,
      }, show_console)
    : Promise.resolve(null);
};


const logMemoryUsage = (label, show_console = false) => {
  if (!show_console) return;
  
  const usage = process.memoryUsage();
  const formatBytes = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;
  
  console.log(`[MEMORY] ${label}:`, {
    rss: `${formatBytes(usage.rss)}MB`,
    heapUsed: `${formatBytes(usage.heapUsed)}MB`, 
    heapTotal: `${formatBytes(usage.heapTotal)}MB`,
    external: `${formatBytes(usage.external)}MB`
  });
  
  // Log additional system info
  if (global.gc) {
    console.log(`[MEMORY] ${label} - Triggering GC...`);
    global.gc();
    const afterGC = process.memoryUsage();
    console.log(`[MEMORY] ${label} - After GC:`, {
      heapUsed: `${formatBytes(afterGC.heapUsed)}MB`,
      heapTotal: `${formatBytes(afterGC.heapTotal)}MB`
    });
  }
};

const logObjectCounts = (label, objects, show_console = false) => {
  if (!show_console) return;
  
  const counts = {};
  Object.keys(objects).forEach(key => {
    const obj = objects[key];
    if (obj && typeof obj === 'object') {
      if (Array.isArray(obj)) {
        counts[`${key}_array_length`] = obj.length;
      } else if (obj.constructor && obj.constructor.name) {
        counts[`${key}_type`] = obj.constructor.name;
      }
      
      // Count nested objects
      if (typeof obj === 'object' && obj !== null) {
        counts[`${key}_keys_count`] = Object.keys(obj).length;
      }
    }
  });
  
  console.log(`[OBJECTS] ${label}:`, counts);
};

// Advanced memory leak detection
const logAdvancedMemoryInfo = (label, show_console = false) => {
  if (!show_console) return;
  
  console.log(`[ADVANCED_MEMORY] ${label}:`, {
    // Process info
    uptime: `${Math.round(process.uptime())}s`,
    // Event loop info
    eventLoopLag: process.hrtime ? 'available' : 'unavailable',
    // Timer info
    activeHandles: process._getActiveHandles ? process._getActiveHandles().length : 'unavailable',
    activeRequests: process._getActiveRequests ? process._getActiveRequests().length : 'unavailable'
  });
  
  // Check for common leak sources
  if (typeof global !== 'undefined') {
    const globalKeys = Object.keys(global).filter(key => 
      key.startsWith('__') || key.includes('cache') || key.includes('store')
    );
    if (globalKeys.length > 0) {
      console.log(`[POTENTIAL_LEAKS] Global keys that might indicate leaks:`, globalKeys);
    }
  }
};

// Memory monitoring for specific intervals
let memoryInterval = null;
const startMemoryMonitoring = (show_console = false) => {
  if (!show_console || memoryInterval) return;
  
  memoryInterval = setInterval(() => {
    logMemoryUsage('INTERVAL_CHECK', true);
  }, 5000); // Check every 5 seconds
};

const stopMemoryMonitoring = () => {
  if (memoryInterval) {
    clearInterval(memoryInterval);
    memoryInterval = null;
  }
};

async function serverRenderAuthorised(req, res, next, htmlData, uiLang, bot) {
  show_console && console.log('serverRenderAuthorised i18nData uiLang', uiLang);
  
  // Log initial memory state
  logMemoryUsage('START_SSR', show_console);
  logAdvancedMemoryInfo('START_SSR', show_console);
  
  // Start interval monitoring for debug mode
  if (show_console) {
    startMemoryMonitoring(show_console);
  }

  const i18nServer = i18nnext.cloneInstance();
  i18nServer.changeLanguage(uiLang, err => {
    show_console && console.log('i18nData language changed', uiLang, err);
    if (err) {
      console.log('Error next', err);
      logMemoryUsage('ERROR_I18N', show_console);
      next(err);
      return;
    }

    const history = createMemoryHistory({
      initialEntries: [req.originalUrl]
    });

    const cookies = cookieParse(req.headers.cookie || '');

    const deviceInfo = new UAParser(req.get('user-agent')).getResult();

    const cookieUILang         = cookies[COOKIE_UI_LANG] || uiLang;
    let cookieContentLanguages = cookies[COOKIE_CONTENT_LANGS] || [uiLang];
    if (typeof cookieContentLanguages === 'string' || cookieContentLanguages instanceof String) {
      cookieContentLanguages = cookieContentLanguages.split(',');
    }

    const initialState = {
      settings: {
        ...settingsInitialState,
        showAllContent: cookies[COOKIE_SHOW_ALL_CONTENT] === 'true' || false
      }
    };
    
    // Log memory after initial setup
    logMemoryUsage('AFTER_INITIAL_SETUP', show_console);
    logObjectCounts('INITIAL_STATE', { initialState, cookies, deviceInfo }, show_console);
    
    // Update settings store with languages info.
    show_console && console.log('onSetUILang', cookieUILang, cookieContentLanguages, cookies[COOKIE_UI_LANG], uiLang);
    onSetUILanguage(initialState.settings, { uiLang: cookieUILang });
    onSetContentLanguages(initialState.settings, { contentLanguages: cookieContentLanguages });
    if (uiLang !== cookieUILang) {
      onSetUrlLanguage(initialState.settings, uiLang);
    }

    if (bot) {
      initialState.auth = { user: { name: KC_BOT_USER_NAME } };
    }

    const store = createStore(initialState, history);

    // Dispatching languages change updates tags and sources.
    store.dispatch(settings.setUILanguage({ uiLang: cookieUILang }));
    store.dispatch(settings.setContentLanguages({ contentLanguages: cookieContentLanguages }));
    store.dispatch(backendApi.util.invalidateTags([wholeSimpleMode, wholeMusic]));

    // Log memory after store creation
    logMemoryUsage('AFTER_STORE_CREATION', show_console);
    logObjectCounts('STORE_STATE', { 
      storeState: store.getState(),
      storeKeys: Object.keys(store.getState())
    }, show_console);

    const context = {
      req,
      data: {},
      head: [],
      i18n: i18nServer
    };

    const routes  = useRoutes(<></>).map(r => ({ ...r, path: `${uiLang}/${r.path}` }));
    const reqPath = req.originalUrl.split('?')[0];
    const branch  = matchRoutes(routes, reqPath) || [];

    let hrstart = process.hrtime();

    show_console && console.log('serverRender: ');

    moment.locale(context.i18n.language === LANG_UKRAINIAN ? 'uk' : context.i18n.language);
    const promises    = branch.map(b => getPromises(store, req.originalUrl, cookieUILang, cookieContentLanguages, show_console, b));
    const rtkPromises = store.dispatch(backendApi.util.getRunningQueriesThunk());
    show_console && console.log('serverRender: promises %d, RTK promises %d', promises.length, rtkPromises.length);
    rtkPromises.forEach(promise => promises.push(promise));
    let hrend = process.hrtime(hrstart);
    show_console && console.log('serverRender: fire ssrLoaders %ds %dms', hrend[0], hrend[1] / 1000000);
    
    // Log memory before promise execution
    logMemoryUsage('BEFORE_PROMISES', show_console);
    logObjectCounts('PROMISES_INFO', { 
      promises: promises.length,
      rtkPromises: rtkPromises.length,
      branch: branch.length,
      routes: routes.length
    }, show_console);
    
    hrstart = process.hrtime();
    Promise.all(promises)
      .then(() => {
        store.stopSagas();
        hrend = process.hrtime(hrstart);
        show_console && console.log('serverRender: Promise.all(promises) %ds %dms', hrend[0], hrend[1] / 1000000);
        
        // Log memory after promises resolve
        logMemoryUsage('AFTER_PROMISES_RESOLVE', show_console);
        logObjectCounts('STORE_AFTER_PROMISES', {
          storeState: store.getState(),
          storeKeys: Object.keys(store.getState())
        }, show_console);
        
        hrstart = process.hrtime();

        store.rootSagaPromise
          .then(() => {
            hrend = process.hrtime(hrstart);
            show_console && console.log('serverRender: rootSagaPromise.then %ds %dms', hrend[0], hrend[1] / 1000000);
            
            // Log memory after saga completion
            logMemoryUsage('AFTER_SAGA_COMPLETION', show_console);
            
            hrstart      = process.hrtime();
            
            // Log memory before rendering
            logMemoryUsage('BEFORE_RENDERING', show_console);
            
            // Actual render.
            const markup = ReactDOMServer.renderToString(
              <React.StrictMode>
                <ErrorBoundary>
                  <HelmetProvider context={helmetContext}>
                    <App
                      i18n={context.i18n}
                      store={store}
                      history={history}
                      deviceInfo={deviceInfo}
                    />
                  </HelmetProvider>
                </ErrorBoundary>
              </React.StrictMode>
            );

            show_console && console.log('serverRender: markup', markup);
            hrend = process.hrtime(hrstart);
            show_console && console.log('serverRender: renderToString %ds %dms', hrend[0], hrend[1] / 1000000);
            
            // Log memory after rendering
            logMemoryUsage('AFTER_RENDERING', show_console);
            logObjectCounts('RENDERING_INFO', {
              markupLength: markup.length,
              helmetContext: Object.keys(helmetContext).length
            }, show_console);
            logAdvancedMemoryInfo('AFTER_RENDERING', show_console);
            
            hrstart = process.hrtime();

            const { helmet } = helmetContext;
            hrend            = process.hrtime(hrstart);
            show_console && console.log('serverRender: Helmet.renderStatic %ds %dms', hrend[0], hrend[1] / 1000000);

            if (context.url) {
              // Somewhere a `<Redirect>` was rendered.
              res.redirect(301, context.url);
            } else {
              // We're good, add in markup, send the response.
              const direction    = getLanguageDirection(uiLang);
              const cssDirection = direction === 'ltr' ? '' : '.rtl';

              const i18nData = serialize(
                {
                  initialLanguage : context.i18n.language,
                  initialI18nStore: pick(context.i18n.services.resourceStore.data, [
                    context.i18n.language,
                    context.i18n.options.fallbackLng
                  ])
                }
              );

              store.dispatch(ssr.prepare());
              // console.log(require('util').inspect(store.getState(), { showHidden: true, depth: 2 }));
              const storeData    = store.getState();
              const storeDataStr = serialize(storeData);
              show_console && console.log('serverRender: redux data before return', storeData.auth);
              
              // Log memory before response preparation
              logMemoryUsage('BEFORE_RESPONSE_PREP', show_console);
              logObjectCounts('RESPONSE_DATA', {
                storeDataStr: storeDataStr.length,
                storeData: Object.keys(storeData).length
              }, show_console);
              
              const rootDiv = `
                <div id="root" class="${direction}" style="direction: ${direction}">${markup}</div>
                <script>
                  window.__botKCInfo = ${storeData.auth?.user?.name === KC_BOT_USER_NAME ? serialize(storeData.auth) : false};
                  window.__data = ${storeDataStr};
                  window.__i18n = ${i18nData};
                  ${windowEnvVariables()}
                </script>
                `;

              const html = htmlData
                .replace(/<html lang="en">/, `<html lang="en" ${helmet.htmlAttributes.toString()} >`)
                .replace(/lang="en"/, `lang="${uiLang}"`)
                .replace(/<title>.*<\/title>/, helmet.title.toString())
                .replace(/<\/head>/, `${helmet.meta.toString()}${helmet.link.toString()}${canonicalLink(req, uiLang)}${alternateLinks(req, uiLang)}${ogUrl(req, uiLang)}</head>`)
                .replace(/<body>/, `<body ${helmet.bodyAttributes.toString()} >`)
                .replace(/semantic_v4.min.css/g, `semantic_v4${cssDirection}.min.css`)
                .replace(/<div id="root"><\/div>/, rootDiv);

              show_console && console.log('serverRender: rendered html', html);

              if (context.code) {
                res.status(context.code);
              }

              // Log final memory state before response
              logMemoryUsage('BEFORE_SEND_RESPONSE', show_console);
              logObjectCounts('FINAL_HTML', {
                htmlLength: html.length,
                rootDivLength: rootDiv.length
              }, show_console);
              logAdvancedMemoryInfo('BEFORE_SEND_RESPONSE', show_console);

              res.send(html);
              
              // Stop memory monitoring and log final state
              stopMemoryMonitoring();
              
              // Log memory after response sent (cleanup check)
              setTimeout(() => {
                logMemoryUsage('AFTER_RESPONSE_SENT', show_console);
                logAdvancedMemoryInfo('AFTER_RESPONSE_SENT', show_console);
              }, 100);
            }
          })
          .catch((a, b, c) => {
            console.log('Root saga error', a, b, c);
            logMemoryUsage('ERROR_ROOT_SAGA', true); // Always log errors
            logAdvancedMemoryInfo('ERROR_ROOT_SAGA', true);
            stopMemoryMonitoring(); // Cleanup on error
            return next(a);
          });
      })
      .catch((a, b, c) => {
        console.log('SSR error', a, b, c);
        logMemoryUsage('ERROR_SSR', true); // Always log errors
        logAdvancedMemoryInfo('ERROR_SSR', true);
        stopMemoryMonitoring(); // Cleanup on error
        return next(a);
      });
  });
}

const ADDITIONAL_BOTS = ['Google-InspectionTool', 'Storebot-Google', 'GoogleOther'];

function isBot(req) {
  return crawlers.some(entry => RegExp(entry.pattern).test(req.headers['user-agent']))
    || ADDITIONAL_BOTS.some(p => RegExp(p).test(req.headers['user-agent']));
}

// see https://yoast.com/rel-canonical/
function canonicalLink(req, lang) {
  // strip ui language from path
  let cPath = req.originalUrl;
  if (lang && cPath.startsWith(`/${lang}`)) {
    cPath = cPath.substring(3);
  }

  const s = cPath.split('?');

  // start with path part
  cPath = s[0];

  // strip leading slash as it comes from BASE_URL
  if (cPath.startsWith('/')) {
    cPath = cPath.substring(1);
  }

  // strip trailing slash as we don't use those
  if (cPath.endsWith('/')) {
    cPath = cPath.substring(0, cPath.length - 1);
  }

  // clean content invariant keys from search part (query)
  if (s.length > 1) {
    const q = qs.parse(s[1]);
    delete q.sstart;      // player slice start
    delete q.send;        // player slice end
    delete q.language;    // content language

    // This one is conceptually wrong.
    // As changing the active part in a playlist would most definitely
    // change the page's content.
    // Most of the content would seem to duplicate the CU page.
    // However, it's logically not easy and some units may not
    // have their own CU page so we skip it.
    delete q.ap;          // playlist active part

    if (!isEmpty(q)) {
      cPath = `${cPath}?${qs.stringify(q)}`;
    }
  }

  if (/\/gr-/.test(cPath)) { // Rabash Group Articles
    const result = /(.+)\/gr-(.+)$/.exec(cPath);
    cPath        = `${result[1]}/${result[2]}`;
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
  if (aPath.startsWith('/')) {
    aPath = aPath.substring(1);
  }

  return LANG_UI_LANGUAGES
    .map(x => {
      const l = getLanguageLocaleWORegion(x);
      return `<link rel="alternate" href="${BASE_URL}${x}/${aPath}" hreflang="${l}" />`;
    })
    .join('');
}

function ogUrl(req, lang) {
  // strip ui language from path
  let aPath = req.originalUrl;
  if (lang && aPath.startsWith(`/${lang}`)) {
    aPath = aPath.substring(3);
  }

  // strip leading slash as it comes from BASE_URL
  if (aPath.startsWith('/')) {
    aPath = aPath.substring(1);
  }

  return `<meta property="og:url" content="${BASE_URL}${lang}/${aPath}" />`;
}

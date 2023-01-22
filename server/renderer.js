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
import { COOKIE_CONTENT_LANG, LANG_UI_LANGUAGES, LANG_UKRAINIAN } from '../src/helpers/consts';
import { getLanguageLocaleWORegion, getLanguageDirection } from '../src/helpers/i18n-utils';
import { getLanguageFromPath } from '../src/helpers/url';
import { isEmpty } from '../src/helpers/utils';
import createStore from '../src/redux/createStore';
import { actions as ssr } from '../src/redux/modules/ssr';
import { actions as settings, initialState as settingsInitialState } from '../src/redux/modules/settings';
import i18nnext from './i18nnext';
import App from '../src/components/App/App';
import moment from 'moment/moment';
import { pick } from 'lodash/object';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from '../src/components/ErrorBoundary';

const helmetContext = {};

// eslint-disable-next-line no-unused-vars
const DoNotRemove = localStorage; // DO NOT REMOVE - the import above does all the work

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function serverRender(req, res, next, htmlData) {
  console.log('serverRender', req.originalUrl);
  const { language, redirect } = getLanguageFromPath(req.originalUrl, req.headers, req.get('user-agent'));
  if (redirect) {
    const newUrl = `${BASE_URL}${language}${req.originalUrl}`;
    console.log(`serverRender: redirect (${language}) => ${newUrl}`);
    res.writeHead(307, { Location: newUrl });
    res.end();
    return;
  }

  const cookies = cookieParse(req.headers.cookie || '');
  const bot     = isBot(req);
  if (cookies['authorised'] || bot) {
    serverRenderAuthorised(req, res, next, htmlData, language, bot);
    return;
  }
  serverRenderSSOAuth(req, res, next, htmlData, language);
}

function serverRenderSSOAuth(req, res, next, htmlData) {
  const rootDiv = `<h1 style="text-align: center">We try to authorise</h1>
    <script>window.__isAuthApp = true;</script>`;
  const html    = htmlData.replace(/<div id="root"><\/div>/, rootDiv);

  console.log('AuthApp server render');
  res.send(html);
}

async function serverRenderAuthorised(req, res, next, htmlData, language, bot) {

  moment.locale(language === LANG_UKRAINIAN ? 'uk' : language);

  const i18nServer = i18nnext.cloneInstance();
  i18nServer.changeLanguage(language, err => {
    if (err) {
      next(err);
      return;
    }

    const history = createMemoryHistory({
      initialEntries: [req.originalUrl],
    });

    const cookies = cookieParse(req.headers.cookie || '');

    const deviceInfo = new UAParser(req.get('user-agent')).getResult();

    const initialState = {
      settings: { ...settingsInitialState, language, contentLanguage: cookies[COOKIE_CONTENT_LANG], },
    };

    if (bot) {
      initialState.auth = { user: { name: 'bot' } };
    }

    const store = createStore(initialState, history);
    store.dispatch(settings.setLanguage(language));

    const context = {
      req,
      data: {},
      head: [],
      i18n: i18nServer,
    };

    const routes  = useRoutes();
    const reqPath = req.originalUrl.split('?')[0];
    const branch  = matchRoutes(routes, reqPath) || [];
    console.log('serverRender: for path %s was found branch %o', reqPath, branch);

    let hrstart    = process.hrtime();
    const promises = branch.map(({ route, params }) => (
      route.ssrData
        ? route.ssrData(store, { params, parsedURL: new URL(req.originalUrl, 'https://example.com') })
        : Promise.resolve(null)
    ));
    let hrend      = process.hrtime(hrstart);

    console.log('serverRender: fire ssrLoaders %ds %dms', hrend[0], hrend[1] / 1000000);
    hrstart = process.hrtime();

    Promise.all(promises)
      .then(() => {
        store.stopSagas();
        hrend = process.hrtime(hrstart);
        console.log('serverRender: Promise.all(promises) %ds %dms', hrend[0], hrend[1] / 1000000);
        hrstart = process.hrtime();

        store.rootSagaPromise
          .then(() => {
            hrend = process.hrtime(hrstart);
            console.log('serverRender: rootSagaPromise.then %ds %dms', hrend[0], hrend[1] / 1000000);
            hrstart      = process.hrtime();
            // actual render
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
            hrend        = process.hrtime(hrstart);
            console.log('serverRender: renderToString %ds %dms', hrend[0], hrend[1] / 1000000);
            hrstart = process.hrtime();

            const { helmet } = helmetContext;
            hrend            = process.hrtime(hrstart);
            console.log('serverRender:  Helmet.renderStatic %ds %dms', hrend[0], hrend[1] / 1000000);

            if (context.url) {
              // Somewhere a `<Redirect>` was rendered
              res.redirect(301, context.url);
            } else {
              // we're good, add in markup, send the response
              const direction    = getLanguageDirection(language);
              const cssDirection = direction === 'ltr' ? '' : '.rtl';

              store.dispatch(ssr.prepare());
              // console.log(require('util').inspect(store.getState(), { showHidden: true, depth: 2 }));
              const storeData = serialize(store.getState());

              const i18nData = serialize(
                {
                  initialLanguage: context.i18n.language,
                  initialI18nStore: pick(context.i18n.services.resourceStore.data, [
                    context.i18n.language,
                    context.i18n.options.fallbackLng,
                  ]),
                }
              );

              const rootDiv = `<div id="root" class="${direction}" style="direction: ${direction}">${markup}</div>
<script>
  window.__data = ${storeData};
  window.__i18n = ${i18nData};
</script>`;

              const html = htmlData
                .replace(/<html lang="en">/, `<html lang="en" ${helmet.htmlAttributes.toString()} >`)
                .replace(/<title>.*<\/title>/, helmet.title.toString())
                .replace(/<\/head>/, `${helmet.meta.toString()}${helmet.link.toString()}${canonicalLink(req, language)}${alternateLinks(req, language)}${ogUrl(req, language)}</head>`)
                .replace(/<body>/, `<body ${helmet.bodyAttributes.toString()} >`)
                .replace(/semantic_v4.min.css/g, `semantic_v4${cssDirection}.min.css`)
                .replace(/<div id="root"><\/div>/, rootDiv);

              if (context.code) {
                res.status(context.code);
              }

              res.send(html);
            }
          })
          .catch(next);
      })
      .catch(next);
  });
}

function isBot(req) {
  return crawlers.some(entry => RegExp(entry.pattern).test(req.headers['user-agent']));
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

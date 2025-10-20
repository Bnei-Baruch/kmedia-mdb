import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createMemoryHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import moment from 'moment';
import localStorage from 'mock-local-storage';

import App from '../../src/components/App/App';
import ErrorBoundary from '../../src/components/ErrorBoundary';
import i18nnext from '../i18nnext';
import { actions as ssr } from '../../src/redux/modules/ssr';

import { shouldTreatAsBot } from './bot-detection';
import { extractUILanguage, extractCookieLanguages, getMomentLocale } from './language-handler';
import { buildSSRHtml, buildSSOAuthHtml } from './html-builder';
import { loadSSRData, waitForSagas } from './data-loader';
import { initializeStore, getDeviceInfo } from './store-initializer';

// eslint-disable-next-line no-unused-vars
const DoNotRemove = localStorage; // DO NOT REMOVE - the import above does all the work

const helmetContext = {};

/**
 * Renders React app to HTML string
 */
function renderReactApp(i18n, store, history, deviceInfo, showConsole = false) {
  const hrstart = process.hrtime();
  
  const markup = ReactDOMServer.renderToString(
    <React.StrictMode>
      <ErrorBoundary>
        <HelmetProvider context={helmetContext}>
          <App
            i18n={i18n}
            store={store}
            history={history}
            deviceInfo={deviceInfo}
          />
        </HelmetProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );

  const hrend = process.hrtime(hrstart);
  showConsole && console.log('SSR: renderToString completed in %ds %dms', hrend[0], hrend[1] / 1000000);

  return markup;
}

/**
 * Handles SSR for authenticated/bot requests
 */
async function handleAuthorisedSSR(req, res, next, htmlData, uiLang, isBot) {
  const showConsole = req.originalUrl.includes('ssr_debug');
  showConsole && console.log('SSR: Handling authorised request for', req.originalUrl);

  // Set moment locale
  moment.locale(getMomentLocale(uiLang));

  // Clone i18n instance and change language
  const i18nServer = i18nnext.cloneInstance();
  
  try {
    await new Promise((resolve, reject) => {
      i18nServer.changeLanguage(uiLang, err => {
        if (err) {
          console.log('Error changing i18n language', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Create history
    const history = createMemoryHistory({
      initialEntries: [req.originalUrl]
    });

    // Extract language preferences
    const { cookieUILang, cookieContentLanguages } = extractCookieLanguages(req, uiLang);

    // Initialize Redux store
    const store = initializeStore({
      req,
      history,
      cookieUILang,
      cookieContentLanguages,
      uiLang,
      isBot,
      showConsole
    });

    // Create context
    const context = {
      req,
      data: {},
      head: [],
      i18n: i18nServer
    };

    // Load SSR data
    await loadSSRData({
      store,
      req,
      uiLang,
      cookieUILang,
      cookieContentLanguages,
      showConsole
    });

    // Wait for sagas to complete
    await waitForSagas(store, showConsole);

    // Wait for any remaining RTK Query requests
    try {
      const { backendApi } = require('../../src/redux/api/backendApi');
      const rtkQueriesThunk = backendApi.util?.getRunningQueriesThunk?.();
      if (rtkQueriesThunk) {
        await store.dispatch(rtkQueriesThunk);
        showConsole && console.log('SSR: Waited for remaining RTK queries');
      }
    } catch (error) {
      showConsole && console.log('SSR: Error waiting for RTK queries:', error.message);
    }

    // Render React app
    const deviceInfo = getDeviceInfo(req);
    const markup = renderReactApp(context.i18n, store, history, deviceInfo, showConsole);

    // Get helmet data
    const { helmet } = helmetContext;

    // Handle redirects
    if (context.url) {
      res.redirect(301, context.url);
      return;
    }

    // Prepare store data
    store.dispatch(ssr.prepare());
    const storeData = store.getState();
    showConsole && console.log('SSR: Redux auth data', storeData.auth);

    // Build final HTML
    const html = buildSSRHtml(htmlData, {
      markup,
      storeData,
      i18n: context.i18n,
      uiLang,
      helmet,
      req
    });

    showConsole && console.log('SSR: Sending rendered HTML');

    // Set status code if provided
    if (context.code) {
      res.status(context.code);
    }

    res.send(html);
  } catch (error) {
    console.log('SSR error:', error);
    next(error);
  }
}

/**
 * Handles SSR for SSO authentication flow (non-authorised users)
 */
function handleSSOAuthSSR(req, res, next, htmlData) {
  const showConsole = req.originalUrl.includes('ssr_debug');
  showConsole && console.log('SSR: Handling SSO auth request');

  const html = buildSSOAuthHtml(htmlData);
  res.send(html);
}

/**
 * Main SSR entry point
 */
export default function serverRender(req, res, next, htmlData) {
  // Skip anonymous requests
  if (req.originalUrl.includes('anonymous')) {
    return;
  }

  const showConsole = req.originalUrl.includes('ssr_debug');
  showConsole && console.log('SSR: serverRender called for', req.originalUrl);
  showConsole && console.log('SSR: Headers', req.headers);

  // Extract and validate UI language
  const { uiLang, shouldRedirect, redirectUrl } = extractUILanguage(req);
  showConsole && console.log('SSR: UI Language', uiLang, 'Redirect:', shouldRedirect);

  // Handle language redirect
  if (shouldRedirect) {
    showConsole && console.log('SSR: Redirecting to', redirectUrl);
    res.writeHead(307, { Location: redirectUrl });
    res.end();
    return;
  }

  // Check if request is from bot or has authorised cookie
  const isBot = shouldTreatAsBot(req);
  const cookies = req.headers.cookie || '';
  const hasAuthCookie = cookies.includes('authorised') || req.query.authorised;

  showConsole && console.log('SSR: Is bot:', isBot, 'Has auth cookie:', hasAuthCookie);

  // Route to appropriate handler
  if (hasAuthCookie || isBot) {
    handleAuthorisedSSR(req, res, next, htmlData, uiLang, isBot);
  } else {
    handleSSOAuthSSR(req, res, next, htmlData);
  }
}


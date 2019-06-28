// import 'core-js/shim';
// import 'regenerator-runtime/runtime';
// import 'babel-polyfill';
// core-js v2

// Stage 3
import "core-js/fn/string/trim-left";
import "core-js/fn/string/trim-right";
import "core-js/fn/string/match-all";
import "core-js/fn/array/flat-map";
import "core-js/fn/array/flatten"; // RENAMED
import "core-js/fn/global";

// Stage 1
import "core-js/fn/symbol/observable";
import "core-js/fn/promise/try";
import "core-js/fn/observable";

import moment from 'moment';
import 'moment/locale/he';
import 'moment/locale/ru';
import 'moment/locale/es';
import 'moment/locale/uk';
import 'moment/locale/it';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';

import { DEFAULT_LANGUAGE, LANG_UKRAINIAN } from './helpers/consts';
import i18n from './helpers/i18nnext';
import createStore from './redux/createStore';
import { actions as mdb } from './redux/modules/mdb';
import ErrorBoundary from './components/ErrorBoundary';
import { actions as ssr } from './redux/modules/ssr';
import App from './components/App/App';

ReactGA.initialize('UA-108372395-1', { gaOptions: { transport: 'beacon' } });

const history = createBrowserHistory();
const store   = createStore(window.__data, history);
store.dispatch(ssr.hydrate());
// console.log('window.__data', window.__data);

const i18nData = window.__i18n || {};

// Initialize moment global locale to default language
const language = i18nData.initialLanguage || DEFAULT_LANGUAGE;
moment.locale(language === LANG_UKRAINIAN ? 'uk' : language);

ReactDOM.hydrate(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <App i18n={i18n} store={store} history={history} {...i18nData} />
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

// We ask for semi-quasi static data here since
// we strip it from SSR to save initial network bandwidth
store.dispatch(mdb.fetchSQData());

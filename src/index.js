// full ES2015+ environment (no < Stage 4 proposals)
import 'core-js/stable';
import 'core-js/proposals/url';
import 'regenerator-runtime/runtime';

import moment from 'moment';
import 'moment/locale/he';
import 'moment/locale/ru';
import 'moment/locale/es';
import 'moment/locale/uk';
import 'moment/locale/it';
import 'moment/locale/de';
import 'moment/locale/tr';
import 'moment/locale/cs';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';

import { DEFAULT_LANGUAGE, LANG_UKRAINIAN } from './helpers/consts';
import config from './helpers/config';
import i18n from './helpers/i18nnext';
import createStore from './redux/createStore';
import { actions as mdb } from './redux/modules/mdb';
import ErrorBoundary from './components/ErrorBoundary';
import { actions as ssr } from './redux/modules/ssr';
import App from './components/App/App';
import UAParser from 'ua-parser-js';
import ClientChronicles from './helpers/clientChronicles'
import { CreateAbTesting } from './helpers/ab-testing'

ReactGA.initialize('UA-108372395-1', { gaOptions: { transport: 'beacon' } });

config.load(window.__config || {});
config.dump();

const history = createBrowserHistory();
const store   = createStore(window.__data, history);
store.dispatch(ssr.hydrate());
// console.log('window.__data', window.__data);

const i18nData = window.__i18n || {};

// Initialize moment global locale to default language
const language = i18nData.initialLanguage ?? DEFAULT_LANGUAGE;
moment.locale(language === LANG_UKRAINIAN ? 'uk' : language);

const deviceInfo = new UAParser().getResult();
const clientChronicles = new ClientChronicles(history, store);
const abTesting = CreateAbTesting(clientChronicles.userId);
clientChronicles.setAbTesting(abTesting);

ReactDOM.hydrate(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <App i18n={i18n} store={store} history={history} deviceInfo={deviceInfo} clientChronicles={clientChronicles} abTesting={abTesting} {...i18nData} />
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

// We ask for semi-quasi static data here since
// we strip it from SSR to save initial network bandwidth
store.dispatch(mdb.fetchSQData());

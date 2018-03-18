import 'core-js/shim';
import 'regenerator-runtime/runtime';
import 'babel-polyfill';
import moment from 'moment';
import 'moment/locale/he';
import 'moment/locale/ru';
import 'moment/locale/es';
import 'moment/locale/uk';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import createHistory from 'history/createBrowserHistory';

import { DEFAULT_LANGUAGE, LANG_UKRAINIAN } from './helpers/consts';
import i18n from './helpers/i18nnext';
import createStore from './redux/createStore';
import { actions as mdb } from './redux/modules/mdb';
import App from './components/App/App';

ReactGA.initialize('UA-108372395-1', { gaOptions: { transport: 'beacon' } });

const history = createHistory();
const store   = createStore(window.__data, history);
console.log('window.__data', window.__data);

// eslint-disable-next-line no-underscore-dangle
const i18nData = window.__i18n || {};

// Initialize moment global locale to default language
const language = i18nData.initialLanguage || DEFAULT_LANGUAGE;
moment.locale(language === LANG_UKRAINIAN ? 'uk' : language);

ReactDOM.render(
  <App i18n={i18n} store={store} history={history} {...i18nData} />,
  document.getElementById('root')
);

// We ask for semi-quasi static data here since
// we strip it from SSR to save initial network bandwidth
store.dispatch(mdb.fetchSQData());

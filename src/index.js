import 'core-js/shim';
import 'regenerator-runtime/runtime';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import createHistory from 'history/createBrowserHistory';

import createStore from './redux/createStore';
import i18n from './helpers/i18nnext';
import App from './components/App/App';
import { DEFAULT_LANGUAGE } from './helpers/consts';

ReactGA.initialize('UA-108372395-1');

const history = createHistory();
const store   = createStore(window.__data, history);

const i18nData = window.__i18n || { locale: DEFAULT_LANGUAGE };
i18n.changeLanguage(i18nData.locale);
if (i18nData.resources) {
  i18n.addResourceBundle(i18nData.locale, 'common', i18nData.resources, true);
} else {
  console.log('Note: No i18n resources from server.');
}

ReactDOM.render(
  <App i18n={i18n} store={store} history={history} />,
  document.getElementById('root')
);

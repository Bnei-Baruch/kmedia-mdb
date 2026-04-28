import { setupListeners } from '@reduxjs/toolkit/query';
import { createBrowserHistory } from 'history';
import 'moment/locale/cs';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/he';
import 'moment/locale/it';
import 'moment/locale/ru';
import 'moment/locale/tr';
import 'moment/locale/uk';
import { initializeI18nClient } from '../../helpers/i18nnext';
import { actions as mdbActions } from '../../redux/modules/mdb';

import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga';

import { UAParser } from 'ua-parser-js';
import { CreateAbTesting } from '../../helpers/ab-testing';
import ClientChronicles from '../../helpers/clientChronicles';
import { KC_BOT_USER_NAME } from '../../helpers/consts';
import { initKC } from '../../pkg/ksAdapter/adapter';

import logger from '../../logger/logger';
import { createStore } from '../../redux/createStore';
import { actions as ssr } from '../../redux/modules/ssr';
import AppClient from './AppClient';

const NAME_SPACE = 'app_client';
logger.log(NAME_SPACE, 'loaded');

async function hydrateApp(kcInfo) {
  // eslint-disable-next-line import/no-named-as-default-member
  ReactGA.initialize('UA-108372395-1', { gaOptions: { transport: 'beacon' } });
  logger.log(NAME_SPACE, 'hydrateApp __i18n', window.__i18n);
  logger.log(NAME_SPACE, 'hydrateApp __data', window.__data);
  logger.log(NAME_SPACE, 'hydrateApp __botKCInfo', window.__botKCInfo);

  const history = createBrowserHistory();
  let initialState;
  if (window.__data) {
    initialState = { ...window.__data, auth: kcInfo };
  } else {
    initialState = { auth: kcInfo };
  }

  const store = createStore(initialState, history);

  // optional, but required for refetchOnFocus/refetchOnReconnect behaviors
  // see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
  setupListeners(store.dispatch);
  store.dispatch(ssr.hydrate());
  store.dispatch(mdbActions.fetchSQData());

  //const { initialLanguage, initialI18nStore } = window.__i18n || { initialLanguage: DEFAULT_UI_LANGUAGE, initialI18nStore: {} };

  // Initialize moment global locale to default language
  //moment.locale(initialLanguage === LANG_UKRAINIAN ? 'uk' : initialLanguage);
  //const i18n = await initializeI18n(initialI18nStore);

  const i18n = await initializeI18nClient();
  const deviceInfo = new UAParser().getResult();
  const clientChronicles = new ClientChronicles(history, store);
  const abTesting = CreateAbTesting(clientChronicles.userId);
  clientChronicles.setAbTesting(abTesting);
  const component = (
    <AppClient
      i18n={i18n}
      store={store}
      history={history}
      deviceInfo={deviceInfo}
      clientChronicles={clientChronicles}
      abTesting={abTesting}
    />
  );

  const el = document.getElementById('root');
  //hydrateRoot(el, component);
  createRoot(el).render(component);
  // We ask for semi-quasi static data here since
  // we strip it from SSR to save initial network bandwidth
  logger.log(NAME_SPACE, 'hydrateApp fetchSQData');
}

logger.log(NAME_SPACE, 'window __i18n, __data, __botKCInfo', window.__i18n, window.__data, window.__botKCInfo);

if (window.__isAuthApp) {
  initKC();
} else if (window.__botKCInfo?.user?.name === KC_BOT_USER_NAME) {
  hydrateApp(window.__botKCInfo);
} else {
  hydrateApp({ user: { name: 'test' } });
  //initKC().then(info => hydrateApp(info));
}

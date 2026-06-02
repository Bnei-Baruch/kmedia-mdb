import { setupListeners } from '@reduxjs/toolkit/query';
import { createBrowserHistory } from 'history';
import moment from 'moment';
import 'moment/locale/cs';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/he';
import 'moment/locale/it';
import 'moment/locale/ru';
import 'moment/locale/tr';
import 'moment/locale/uk';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import ReactGA from 'react-ga';
import { UAParser } from 'ua-parser-js';
import { CreateAbTesting } from '../../helpers/ab-testing';
import ClientChronicles from '../../helpers/clientChronicles';
import { DEFAULT_UI_LANGUAGE, LANG_UKRAINIAN } from '../../helpers/consts';
import { initializeI18n } from '../../helpers/i18nnext';
import { initKC } from '../../pkg/ksAdapter/adapter';
import logger from '../../logger/logger';
import { createStore } from '../../redux/createStore';
import { actions as authActions } from '../../redux/modules/auth';
import { actions as ssr } from '../../redux/modules/ssr';
import AppClient from './AppClient';

const NAMESPACE = 'app-client';


async function buildApp(kcInfo = null) {
  ReactGA.initialize('UA-108372395-1', { gaOptions: { transport: 'beacon' } });

  const initialState = window.__data ? { ...window.__data } : {};
  if (kcInfo) {
    initialState.auth = kcInfo;
  }

  const history = createBrowserHistory();
  const store = createStore(initialState, history);
  setupListeners(store.dispatch);
  store.dispatch(ssr.hydrate());

  const { initialLanguage, initialI18nStore } = window.__i18n || { initialLanguage: DEFAULT_UI_LANGUAGE, initialI18nStore: {} };
  moment.locale(initialLanguage === LANG_UKRAINIAN ? 'uk' : initialLanguage);

  const i18n = await initializeI18n(initialI18nStore);
  const deviceInfo = new UAParser().getResult();
  const clientChronicles = new ClientChronicles(history, store);
  const abTesting = CreateAbTesting(clientChronicles.userId);
  clientChronicles.setAbTesting(abTesting);

  hydrateRoot(
    document.getElementById('root'),
    <AppClient
      i18n={i18n}
      store={store}
      history={history}
      deviceInfo={deviceInfo}
      clientChronicles={clientChronicles}
      abTesting={abTesting}
    />
  );

  return store;
}

logger.log(NAMESPACE, 'init', { hasBot: !!window.__botKCInfo });

if (window.__botKCInfo) {
  // Bot: auth is already set by SSR — no KC call needed.
  buildApp();
} else {
  // Authenticated user: exchange KC auth code for token before hydrating.
  initKC()
    .then(kcInfo => buildApp(kcInfo).then(store => {
      store.dispatch(authActions.updateToken(kcInfo?.token ?? null));
    }))
    .catch(() => buildApp());
}

import { setupListeners } from "@reduxjs/toolkit/query";
import { createBrowserHistory } from "history";
import moment from "moment";
import "moment/locale/cs";
import "moment/locale/de";
import "moment/locale/es";
import "moment/locale/he";
import "moment/locale/it";
import "moment/locale/ru";
import "moment/locale/tr";
import "moment/locale/uk";

import React from "react";
import { hydrateRoot } from "react-dom/client";
import ReactGA from "react-ga";

import UAParser from "ua-parser-js";
import { CreateAbTesting } from "../../helpers/ab-testing";
import ClientChronicles from "../../helpers/clientChronicles";
import { DEFAULT_UI_LANGUAGE, KC_BOT_USER_NAME, LANG_UKRAINIAN } from "../../helpers/consts";
import { initializeI18n } from "../../helpers/i18nnext";
import { initKC } from "../../pkg/ksAdapter/adapter";
import createStore from "../../redux/createStore";
import { actions as mdbActions } from "../../redux/modules/mdb";
import { actions as ssr } from "../../redux/modules/ssr";
import AppClient from "./AppClient";

async function hydrateApp(kcInfo) {
  ReactGA.initialize("UA-108372395-1", { gaOptions: { transport: "beacon" } });
  console.log("hydrateApp __i18n", window.__i18n);
  console.log("hydrateApp __data", window.__data);
  console.log("hydrateApp __botKCInfo", window.__botKCInfo);

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

  const i18nData = window.__i18n || {};

  // Initialize moment global locale to default language
  const language = i18nData.initialLanguage ?? DEFAULT_UI_LANGUAGE;
  moment.locale(language === LANG_UKRAINIAN ? "uk" : language);

  const i18n = await initializeI18n();
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
      i18nData={i18nData}
    />
  );
  const el = document.getElementById("root");
  hydrateRoot(el, component);
  // We ask for semi-quasi static data here since
  // we strip it from SSR to save initial network bandwidth
  console.log("hydrateApp fetchSQData");
  store.dispatch(mdbActions.fetchSQData());
}

console.log("app-client", window.__i18n, window.__data, window.__botKCInfo);

if (window.__isAuthApp) {
  initKC();
} else if (window.__botKCInfo?.user?.name === KC_BOT_USER_NAME) {
  hydrateApp(window.__botKCInfo);
} else {
  initKC().then((info) => hydrateApp(info));
}

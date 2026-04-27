import i18next from 'i18next';

import i18nextBackend from 'i18next-fs-backend';
import HttpBackend from 'i18next-http-backend';
import path from 'node:path';

import moment from 'moment';
import 'moment/locale/cs';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/he';
import 'moment/locale/it';
import 'moment/locale/ru';
import 'moment/locale/tr';
import 'moment/locale/uk';

import { DEFAULT_UI_LANGUAGE } from './consts';
const _dirname = typeof __dirname !== 'undefined' ? __dirname : '';

let i18n;
export const options = {
  load: 'languageOnly',
  fallbackLng: DEFAULT_UI_LANGUAGE,

  // Have a common namespace used around the full app.
  ns: ['common'],
  defaultNS: 'common',

  debug: false,

  interpolation: {
    escapeValue: false, // Not needed for react!
    format: (value, format) =>
      // Our beloved backend is using UTC so we do it here as well
      moment.utc(value).format(format),
  },

  react: {
    wait: true,
    useSuspense: false,
  },
};

// Client side.
export const initializeI18nClient = async () => {
  const i18n = i18next.createInstance();

  // ИСПОЛЬЗУЕМ HttpBackend ЗДЕСЬ
  await i18n.use(HttpBackend).init({
    ...options,
    lng: 'en',
    preload: ['en', 'he', 'ru', 'es'],
    backend: {
      loadPath: 'http://localhost:3000/locales/{{lng}}/{{ns}}.json',
    },
    initImmediate: false,
  });

  return i18n;
};


export const initializeI18n = async resources => {
  await i18next.init({
    ...options,
    resources,
    initImmediate: false,
  });
  i18n = i18next;
  return i18next;
};

export const initializeI18nBackend = async uiLang => {
  console.log('initializeI18nBackend', uiLang);
  i18n = i18next.createInstance();
  await i18n.use(i18nextBackend).init({
    ...options,
    preload: ['en', 'he', 'ru', 'es'], // preload all languages
    backend: {
      loadPath: path.resolve(process.cwd(), 'public/locales/{{lng}}/{{ns}}.json'),
    },
    lng: uiLang,
  });
  return i18n;
};

export default i18n;

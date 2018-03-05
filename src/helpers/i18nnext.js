import i18n from 'i18next';
import CLIENT_BACKEND from 'i18next-xhr-backend';
import SERVER_BACKEND from 'i18next-node-remote-backend';
import moment from 'moment';
import 'moment/locale/he';
import 'moment/locale/ru';
import 'moment/locale/es';

import { DEFAULT_LANGUAGE } from './consts';

// import Cache from 'i18next-localstorage-cache';
// import LanguageDetector from 'i18next-browser-languagedetector';

const LOCALES_BACKEND = process.env.REACT_APP_LOCALES_BACKEND;

// Initialize moment global locale to default language
moment.locale(DEFAULT_LANGUAGE);

// TODO (yaniv -> edo) should we use a file system backend? the locales are in this repo
const isServer = typeof window === 'undefined';
const BACKEND  = isServer ? SERVER_BACKEND : CLIENT_BACKEND;

// TODO (yaniv): we might not need to initially load any resources on the client since we get resouces from the server

i18n
  .use(BACKEND)
  // .use(Cache)
  // .use(LanguageDetector)
  .init({

    backend: {
      loadPath: `${LOCALES_BACKEND}locales/{{lng}}/{{ns}}.json`,
      crossDomain: true
    },

    fallbackLng: DEFAULT_LANGUAGE,

    react: {
      wait: !isServer, // globally set to wait for loaded translations in translate hoc
      // exposeNamespace: true // exposes namespace on data-i18next-options to be used in eg. locize-editor
    },

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react!!
      format: (value, format) => {
        if (value instanceof Date) {
          return moment(value).format(format);
        }
        return value;
      },
    },

    // cache: {
    //   enabled: true
    // },
  });

export default i18n;

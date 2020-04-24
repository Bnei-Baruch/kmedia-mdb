import i18n from 'i18next';
import backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';
import 'moment/locale/he';
import 'moment/locale/ru';
import 'moment/locale/es';
import 'moment/locale/uk';
import 'moment/locale/it';
import 'moment/locale/de';
import 'moment/locale/tr';

import { DEFAULT_LANGUAGE } from './consts';

const LOCALES_BACKEND = process.env.REACT_APP_LOCALES_BACKEND;

export const options = {
  load: 'languageOnly',

  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,

  // have a common namespace used around the full app
  ns: ['common'],
  defaultNS: 'common',

  debug: false,

  react: {
    useSuspense: false,
  },

  interpolation: {
    escapeValue: false, // not needed for react!!
    format: (value, format) => (
      // Our beloved backend is using UTC so we do it here as well
      moment.utc(value).format(format)
    ),
  },
};

// instance for client side
i18n
  .use(backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    ...options,
    backend: {
      loadPath: `${LOCALES_BACKEND}locales/{{lng}}/{{ns}}.json`,
      crossDomain: true
    },

    react: {
      wait: true, // globally set to wait for loaded translations in withTranslation hoc
    },
  });

export default i18n;

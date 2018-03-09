import i18n from 'i18next';
import backend from 'i18next-xhr-backend';
import moment from 'moment';

import { DEFAULT_LANGUAGE } from './consts';

const LOCALES_BACKEND = process.env.REACT_APP_LOCALES_BACKEND;

export const options = {
  load: 'languageOnly',
  fallbackLng: DEFAULT_LANGUAGE,

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
};

// instance for client side
i18n
  .use(backend)
  .init({
    ...options,
    backend: {
      loadPath: `${LOCALES_BACKEND}locales/{{lng}}/{{ns}}.json`,
      crossDomain: true
    },

    react: {
      wait: true, // globally set to wait for loaded translations in translate hoc
    },
  });

export default i18n;

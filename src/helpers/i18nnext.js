import i18n from 'i18next';
import backend from 'i18next-http-backend';
import moment from 'moment';
import 'moment/locale/he';
import 'moment/locale/ru';
import 'moment/locale/es';
import 'moment/locale/uk';
import 'moment/locale/it';
import 'moment/locale/de';
import 'moment/locale/tr';
import 'moment/locale/cs';

import { DEFAULT_UI_LANGUAGE } from './consts';

const LOCALES_BACKEND = process.env.REACT_APP_LOCALES_BACKEND;

export const options = {
  load: 'languageOnly',
  fallbackLng: DEFAULT_UI_LANGUAGE,

  // Have a common namespace used around the full app.
  ns: ['common'],
  defaultNS: 'common',

  debug: false,

  interpolation: {
    escapeValue: false, // Not needed for react!
    format: (value, format) => (
      // Our beloved backend is using UTC so we do it here as well
      moment.utc(value).format(format)
    ),
  },
};

// Client side.
export const initializeI18n = () => i18n
  .use(backend)
  .init({
    ...options,
    backend: {
      loadPath: `${LOCALES_BACKEND}locales/{{lng}}/{{ns}}.json`,
      crossDomain: true
    },

    react: {
      wait: true, // Globally set to wait for loaded translations in withTranslation hoc.
      useSuspense: true,
    },
  });

export default i18n;

import path from 'path';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import i18nextBackend from 'i18next-node-fs-backend';

import { options } from '../src/helpers/i18nnext';

i18n
  .use(i18nextBackend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    ...options,
    preload: ['en', 'he', 'ru', 'es'], // preload all languages
    backend: {
      loadPath: path.join(__dirname, '../public/locales/{{lng}}/{{ns}}.json'),
    },
    react: {
      wait: false
    }
  });

export default i18n;

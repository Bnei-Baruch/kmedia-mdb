import path from 'path';
import i18next from 'i18next';
import i18nextBackend from 'i18next-node-fs-backend';

import { options } from '../src/helpers/i18nnext';

i18next
  .use(i18nextBackend)
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

export default i18next;

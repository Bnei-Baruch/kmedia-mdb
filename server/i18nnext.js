import i18next from 'i18next';
import i18nextBackend from 'i18next-fs-backend';
import path from 'node:path';

import { options } from '../src/helpers/i18nnext';

const _dirname = typeof __dirname !== 'undefined' ? __dirname : '';

i18next
  .use(i18nextBackend)
  .init({
    ...options,
    preload: ['en', 'he', 'ru', 'es'], // preload all languages
    backend: {
      loadPath: path.join(_dirname, '../public/locales/{{lng}}/{{ns}}.json'),
    }
  });

export default i18next;

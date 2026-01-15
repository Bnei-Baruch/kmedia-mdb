import i18next from 'i18next';
import i18nextBackend from 'i18next-fs-backend';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { options } from '../src/helpers/i18nnext';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18next
  .use(i18nextBackend)
  .init({
    ...options,
    preload: ['en', 'he', 'ru', 'es'], // preload all languages
    backend: {
      loadPath: path.join(__dirname, '../public/locales/{{lng}}/{{ns}}.json'),
    }
  });

export default i18next;

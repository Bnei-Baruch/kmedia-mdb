import i18next from 'i18next';
import moment from 'moment';
// SSR: Node.js require() correctly binds these to the moment singleton.
// Browser: static imports don't register (CJS UMD falls back to window.moment which is
// unset at module-load time). app-client.jsx handles browser locale loading via dynamic imports.
import 'moment/locale/cs';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/he';
import 'moment/locale/it';
import 'moment/locale/ru';
import 'moment/locale/tr';
import 'moment/locale/uk';

import { DEFAULT_UI_LANGUAGE } from './consts';

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
  },

  react: {
    wait: true,
    useSuspense: false,
  },
};

// i18next v26 overwrites interpolation.format with its Formatter; register moment
// formats after init so {{date, ll}} / {{date, l}} keep working.
// Only lowercase variants — the Formatter lowercases all names, so 'LL' would
// overwrite 'll' if both were registered.
// momentLib defaults to this file's import (SSR); client passes its own pre-bundled
// instance so both share the same module reference (Vite creates separate instances
// for files that import node: builtins like this one).
export const registerMomentFormats = (instance, momentLib = moment) => {
  ['l', 'll', 'lll', 'llll'].forEach(fmt => {
    instance.services.formatter.add(fmt, (value, lng) =>
      momentLib.utc(value).locale(lng || DEFAULT_UI_LANGUAGE).format(fmt)
    );
  });
};

export const initializeI18n = async (resources, lng, momentLib) => {
  // eslint-disable-next-line import/no-named-as-default-member
  await i18next.init({
    ...options,
    resources,
    ...(lng ? { lng } : {}),
    initImmediate: false,
  });
  registerMomentFormats(i18next, momentLib);
  i18n = i18next;
  return i18next;
};

export { i18n as default };

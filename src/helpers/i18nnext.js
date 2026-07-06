import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import dayjs from './dayjs';

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

// i18next v26 overwrites interpolation.format with its Formatter; register dayjs
// formats after init so {{date, ll}} / {{date, l}} keep working.
// Only lowercase variants — the Formatter lowercases all names, so 'LL' would
// overwrite 'll' if both were registered.
export const registerDateFormats = instance => {
  ['l', 'll', 'lll', 'llll'].forEach(fmt => {
    instance.services.formatter.add(fmt, (value, lng) =>
      dayjs.utc(value).locale(lng || DEFAULT_UI_LANGUAGE).format(fmt)
    );
  });
};

export const initializeI18n = async (resources, lng) => {
  // eslint-disable-next-line import/no-named-as-default-member
  await i18next.use(HttpBackend).init({
    ...options,
    resources,
    partialBundledLanguages: true,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ...(lng ? { lng } : {}),
    initImmediate: false,
  });
  registerDateFormats(i18next);
  i18n = i18next;
  return i18next;
};

export { i18n as default };

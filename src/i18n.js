import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
// import Cache from 'i18next-localstorage-cache';
// import LanguageDetector from 'i18next-browser-languagedetector';


i18n
  .use(XHR)
  // .use(Cache)
  // .use(LanguageDetector)
  .init({

    backend: {
      loadPath: 'http://rt-dev.kbb1.com:9876/locales/{{lng}}/{{ns}}.json',
      crossDomain: true
    },

    fallbackLng: 'en',

    react: {
      wait: true, // globally set to wait for loaded translations in translate hoc
      // exposeNamespace: true // exposes namespace on data-i18next-options to be used in eg. locize-editor
    },

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    debug: true,

    // cache: {
    //   enabled: true
    // },
  });


export default i18n;

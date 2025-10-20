import { parse as cookieParse } from 'cookie';
import UAParser from 'ua-parser-js';
import createStore from '../../src/redux/createStore';
import { actions as settings, initialState as settingsInitialState, onSetUILanguage, onSetContentLanguages, onSetUrlLanguage } from '../../src/redux/modules/settings';
import { COOKIE_SHOW_ALL_CONTENT, KC_BOT_USER_NAME } from '../../src/helpers/consts';
import { backendApi } from '../../src/redux/api/backendApi';
import { wholeSimpleMode } from '../../src/redux/api/simpleMode';
import { wholeMusic } from '../../src/redux/api/music';

/**
 * Creates initial Redux state from request
 * @param {Object} req - Express request object
 * @param {string} cookieUILang - UI language from cookie
 * @param {Array} cookieContentLanguages - Content languages from cookie
 * @param {string} uiLang - Current UI language
 * @param {boolean} isBot - Whether request is from a bot
 * @returns {Object} - Initial Redux state
 */
function createInitialState(req, cookieUILang, cookieContentLanguages, uiLang, isBot) {
  const cookies = cookieParse(req.headers.cookie || '');

  const initialState = {
    settings: {
      ...settingsInitialState,
      showAllContent: cookies[COOKIE_SHOW_ALL_CONTENT] === 'true' || false
    }
  };

  // Update settings store with languages info
  onSetUILanguage(initialState.settings, { uiLang: cookieUILang });
  onSetContentLanguages(initialState.settings, { contentLanguages: cookieContentLanguages });
  
  if (uiLang !== cookieUILang) {
    onSetUrlLanguage(initialState.settings, uiLang);
  }

  // Add bot user for bot requests
  if (isBot) {
    initialState.auth = { user: { name: KC_BOT_USER_NAME } };
  }

  return initialState;
}

/**
 * Initializes Redux store for SSR
 * @param {Object} options - Initialization options
 * @returns {Object} - Initialized Redux store
 */
export function initializeStore(options) {
  const {
    req,
    history,
    cookieUILang,
    cookieContentLanguages,
    uiLang,
    isBot,
    showConsole = false
  } = options;

  showConsole && console.log('SSR: Initializing store with UI lang:', cookieUILang, 'Content langs:', cookieContentLanguages);

  const initialState = createInitialState(req, cookieUILang, cookieContentLanguages, uiLang, isBot);
  const store = createStore(initialState, history);

  // Dispatch language changes which updates tags and sources
  store.dispatch(settings.setUILanguage({ uiLang: cookieUILang }));
  store.dispatch(settings.setContentLanguages({ contentLanguages: cookieContentLanguages }));
  store.dispatch(backendApi.util.invalidateTags([wholeSimpleMode, wholeMusic]));

  return store;
}

/**
 * Gets device info from user agent
 * @param {Object} req - Express request object
 * @returns {Object} - Parsed device info
 */
export function getDeviceInfo(req) {
  return new UAParser(req.get('user-agent')).getResult();
}


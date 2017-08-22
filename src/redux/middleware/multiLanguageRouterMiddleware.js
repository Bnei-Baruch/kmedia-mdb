import { routerMiddleware as createRouterMiddleware, CALL_HISTORY_METHOD } from 'react-router-redux';
import { prefixWithLanguage } from '../../helpers/language';

/**
 * This middleware uses react-router-redux's middleware and prefixes the location change depending on the language
 */

export default function multiLanguageRouterMiddleware(history) {
  const routerMiddleware = createRouterMiddleware(history);
  return () => next => (action) => {
    if (action.type !== CALL_HISTORY_METHOD) {
      return next(action);
    }

    const { payload: { args } } = action;
    const { location } = history;

    if (Array.isArray(args) && args[0]) {
      const firstArg = args[0];
      if (typeof args[0] === 'string') {
        args[0] = prefixWithLanguage(firstArg, location);
      } else if (firstArg.pathname) {
        args[0].pathname = prefixWithLanguage(firstArg.pathname, location);
      }
    }

    return routerMiddleware(next, action);
  };
}

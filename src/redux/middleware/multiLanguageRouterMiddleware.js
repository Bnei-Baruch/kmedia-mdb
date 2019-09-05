import { CALL_HISTORY_METHOD, routerMiddleware as createRouterMiddleware } from 'connected-react-router';

import { prefixWithLanguage } from '../../helpers/url';

/**
 * This middleware uses connected-react-router's middleware and prefixes the location change depending on the language
 */

export default function multiLanguageRouterMidrdleware(history) {
  const routerMiddleware = createRouterMiddleware(history);
  const appliedRouterMiddleware = routerMiddleware(history);

  return () => next => (action) => {
    if (action.type !== CALL_HISTORY_METHOD) {
      return next(action);
    }

    const { payload: { args } } = action;
    const { location }          = history;

    if (Array.isArray(args) && args[0]) {
      const firstArg = args[0];
      if (typeof args[0] === 'string') {
        args[0] = prefixWithLanguage(firstArg, location);
      } else if (firstArg.pathname) {
        args[0].pathname = prefixWithLanguage(firstArg.pathname, location);
      }
    }

    return appliedRouterMiddleware(next)(action);
  };
}

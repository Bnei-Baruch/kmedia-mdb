'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = multiLanguageRouterMiddleware;

var _reactRouterRedux = require('react-router-redux');

var _url = require('../../helpers/url');

/**
 * This middleware uses react-router-redux's middleware and prefixes the location change depending on the language
 */

function multiLanguageRouterMiddleware(history) {
  var routerMiddleware = (0, _reactRouterRedux.routerMiddleware)(history);
  var appliedRouterMiddleware = routerMiddleware();

  return function () {
    return function (next) {
      return function (action) {
        if (action.type !== _reactRouterRedux.CALL_HISTORY_METHOD) {
          return next(action);
        }

        var args = action.payload.args;
        var location = history.location;


        if (Array.isArray(args) && args[0]) {
          var firstArg = args[0];
          if (typeof args[0] === 'string') {
            args[0] = (0, _url.prefixWithLanguage)(firstArg, location);
          } else if (firstArg.pathname) {
            args[0].pathname = (0, _url.prefixWithLanguage)(firstArg.pathname, location);
          }
        }

        return appliedRouterMiddleware(next)(action);
      };
    };
  };
}
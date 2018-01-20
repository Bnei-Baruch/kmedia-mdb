'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = require('react-router-dom');

var _LanguageSetter = require('../Language/LanguageSetter');

var _LanguageSetter2 = _interopRequireDefault(_LanguageSetter);

var _consts = require('../../helpers/consts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Automatically sets the appropriate language if the url's pathname starts with /<LANGUAGE>/
 * (where <LANGUAGE> is the language's shorthand. for example, for russian use /ru/<rest of url>).
 * It will set the default language if there is no language prefix in the pathname.
 *
 * You should wrap all routes that should be aware of the current language with this component.
 */

var MultiLanguageRouteProvider = function MultiLanguageRouteProvider(_ref) {
  var children = _ref.children;
  return _react2.default.createElement(
    _reactRouterDom.Switch,
    null,
    _react2.default.createElement(_reactRouterDom.Route, {
      path: '/:language([a-z]{2})',
      render: function render(_ref2) {
        var match = _ref2.match;
        return _react2.default.createElement(
          _LanguageSetter2.default,
          { language: match.params.language },
          children
        );
      }
    }),
    _react2.default.createElement(_reactRouterDom.Route, { render: function render() {
        return _react2.default.createElement(
          _LanguageSetter2.default,
          { language: _consts.DEFAULT_LANGUAGE },
          children
        );
      }
    })
  );
};

MultiLanguageRouteProvider.propTypes = {
  children: _propTypes2.default.any.isRequired
};

exports.default = MultiLanguageRouteProvider;
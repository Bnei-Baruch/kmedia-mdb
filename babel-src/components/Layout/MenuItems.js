'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

var _semanticUiReact = require('semantic-ui-react');

var _MultiLanguageNavLink = require('../Language/MultiLanguageNavLink');

var _MultiLanguageNavLink2 = _interopRequireDefault(_MultiLanguageNavLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ITEMS = ['lessons', 'programs', 'lectures', 'sources', 'events', 'books', 'topics', 'publications', 'photos'];

var MenuItems = function MenuItems(props) {
  var simple = props.simple,
      visible = props.visible,
      t = props.t,
      onItemClick = props.onItemClick;


  var items = ITEMS.map(function (x) {
    return _react2.default.createElement(_semanticUiReact.Menu.Item, {
      key: x,
      as: _MultiLanguageNavLink2.default,
      to: '/' + x,
      activeClassName: 'active',
      content: t('nav.sidebar.' + x),
      onClick: onItemClick
    });
  });

  if (simple) {
    return _react2.default.createElement(
      _semanticUiReact.Menu,
      { vertical: true, borderless: true, fluid: true, color: 'blue', size: 'huge' },
      items
    );
  }

  return _react2.default.createElement(
    _semanticUiReact.Sidebar,
    { pointing: true, vertical: true, as: _semanticUiReact.Menu, animation: 'push', visible: visible },
    items
  );
};

MenuItems.propTypes = {
  simple: _propTypes2.default.bool,
  visible: _propTypes2.default.bool,
  t: _propTypes2.default.func.isRequired,
  onItemClick: _propTypes2.default.func
};

MenuItems.defaultProps = {
  simple: false,
  visible: false,
  onItemClick: _identity2.default
};

exports.default = MenuItems;
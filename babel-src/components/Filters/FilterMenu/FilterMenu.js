'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactI18next = require('react-i18next');

var _semanticUiReact = require('semantic-ui-react');

var _shapes = require('../../shapes');

var _FilterMenuItem = require('../FilterMenuItem/FilterMenuItem');

var _FilterMenuItem2 = _interopRequireDefault(_FilterMenuItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FilterMenu = function (_PureComponent) {
  _inherits(FilterMenu, _PureComponent);

  function FilterMenu() {
    _classCallCheck(this, FilterMenu);

    return _possibleConstructorReturn(this, (FilterMenu.__proto__ || Object.getPrototypeOf(FilterMenu)).apply(this, arguments));
  }

  _createClass(FilterMenu, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          items = _props.items,
          active = _props.active,
          onChoose = _props.onChoose,
          t = _props.t,
          namespace = _props.namespace;

      return _react2.default.createElement(
        _semanticUiReact.Menu,
        { secondary: true, pointing: true, color: 'blue', className: 'index-filters', size: 'large' },
        _react2.default.createElement(
          _semanticUiReact.Container,
          { className: 'padded horizontally' },
          _react2.default.createElement(_semanticUiReact.Menu.Item, { header: true, content: t('filters.' + namespace + '.by') }),
          items.map(function (item) {
            return _react2.default.createElement(_FilterMenuItem2.default, {
              key: item.name,
              name: item.name,
              label: t('filters.' + item.name + '.label'),
              isActive: item.name === active,
              onChoose: onChoose
            });
          })
        )
      );
    }
  }]);

  return FilterMenu;
}(_react.PureComponent);

FilterMenu.propTypes = {
  items: _propTypes2.default.arrayOf(_shapes.filterPropShape).isRequired,
  active: _propTypes2.default.string,
  onChoose: _propTypes2.default.func,
  t: _propTypes2.default.func.isRequired,
  namespace: _propTypes2.default.string.isRequired
};
FilterMenu.defaultProps = {
  active: '',
  onChoose: undefined
};
exports.default = (0, _reactI18next.translate)()(FilterMenu);
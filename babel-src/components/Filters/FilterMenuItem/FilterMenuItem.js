'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FilterMenuItem = function (_PureComponent) {
  _inherits(FilterMenuItem, _PureComponent);

  function FilterMenuItem() {
    _classCallCheck(this, FilterMenuItem);

    return _possibleConstructorReturn(this, (FilterMenuItem.__proto__ || Object.getPrototypeOf(FilterMenuItem)).apply(this, arguments));
  }

  _createClass(FilterMenuItem, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          name = _props.name,
          label = _props.label,
          isActive = _props.isActive,
          onChoose = _props.onChoose;

      return _react2.default.createElement(
        _semanticUiReact.Menu.Item,
        { name: name, active: isActive, onClick: function onClick() {
            return onChoose({ name: name });
          } },
        label,
        _react2.default.createElement(_semanticUiReact.Icon, { name: 'dropdown' })
      );
    }
  }]);

  return FilterMenuItem;
}(_react.PureComponent);

FilterMenuItem.propTypes = {
  name: _propTypes2.default.string.isRequired,
  label: _propTypes2.default.string.isRequired,
  isActive: _propTypes2.default.bool,
  onChoose: _propTypes2.default.func
};
FilterMenuItem.defaultProps = {
  isActive: false,
  onChoose: undefined
};
exports.default = FilterMenuItem;
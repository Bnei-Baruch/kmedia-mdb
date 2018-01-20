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

var FilterTag = function (_PureComponent) {
  _inherits(FilterTag, _PureComponent);

  function FilterTag() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FilterTag);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FilterTag.__proto__ || Object.getPrototypeOf(FilterTag)).call.apply(_ref, [this].concat(args))), _this), _this.handleClick = function () {
      _this.props.onClick();
    }, _this.handleClose = function (event) {
      event.stopPropagation();
      _this.props.onClose();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FilterTag, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          icon = _props.icon,
          label = _props.label,
          isActive = _props.isActive;

      var color = isActive ? 'green' : 'blue';

      return _react2.default.createElement(
        _semanticUiReact.Button.Group,
        { size: 'mini' },
        _react2.default.createElement(
          _semanticUiReact.Button,
          { basic: true, as: 'a', color: color, onClick: this.handleClick, ref: function ref(el) {
              return _this2.label = el;
            } },
          _react2.default.createElement(_semanticUiReact.Icon, { name: icon }),
          label
        ),
        _react2.default.createElement(_semanticUiReact.Button, { color: color, icon: 'close', onClick: this.handleClose })
      );
    }
  }]);

  return FilterTag;
}(_react.PureComponent);

FilterTag.propTypes = {
  icon: _propTypes2.default.string.isRequired,
  label: _propTypes2.default.string.isRequired,
  onClose: _propTypes2.default.func.isRequired,
  onClick: _propTypes2.default.func.isRequired,
  isActive: _propTypes2.default.bool
};
FilterTag.defaultProps = {
  isActive: false
};
exports.default = FilterTag;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _semanticUiReact = require('semantic-ui-react');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AVPlaybackRate = function (_Component) {
  _inherits(AVPlaybackRate, _Component);

  function AVPlaybackRate() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AVPlaybackRate);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AVPlaybackRate.__proto__ || Object.getPrototypeOf(AVPlaybackRate)).call.apply(_ref, [this].concat(args))), _this), _this.handleChange = function (e, data) {
      return _this.props.onSelect(e, data.value);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AVPlaybackRate, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          value = _props.value,
          upward = _props.upward;


      var options = ['1x', '1.5x', '2x'].map(function (x) {
        return { value: x, text: x };
      });

      return _react2.default.createElement(
        'div',
        { style: { marginLeft: '5px', marginRight: '5px' } },
        _react2.default.createElement(_semanticUiReact.Dropdown, {
          floating: true,
          scrolling: true,
          upward: upward,
          icon: null,
          selectOnBlur: false,
          options: options,
          value: value,
          onChange: this.handleChange,
          className: (0, _classnames2.default)('player-button')
        })
      );
    }
  }]);

  return AVPlaybackRate;
}(_react.Component);

AVPlaybackRate.propTypes = {
  onSelect: _propTypes2.default.func,
  value: _propTypes2.default.string,
  upward: _propTypes2.default.bool
};
AVPlaybackRate.defaultProps = {
  onSelect: _noop2.default,
  value: '1x',
  upward: true
};
exports.default = AVPlaybackRate;
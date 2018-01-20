'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// NOTE: The rendering of this component should use Popup but there
// is a bug: https://github.com/Semantic-Org/Semantic-UI-React/issues/1065
// When solved use Popup, and update parrents to pass trigger properly.
//
// import { Popup } from 'semantic-ui-react';
//
// <Popup
//   open={opened}
//   content={message}
//   position={`${downward ? 'bottom' : 'top'} right`}
//   offset={10}
//   trigger={trigger}
// />

var POPOVER_CONFIRMATION_TIMEOUT = 2500;

var TimedPopup = function (_Component) {
  _inherits(TimedPopup, _Component);

  function TimedPopup() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TimedPopup);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TimedPopup.__proto__ || Object.getPrototypeOf(TimedPopup)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      opened: false
    }, _this.confirmTimeoutHandle = null, _this.clearConfirmationTimeout = function () {
      if (_this.confirmTimeoutHandle) {
        clearTimeout(_this.confirmTimeoutHandle);
        _this.confirmTimeoutHandle = null;
      }
    }, _this.onTrigger = function () {
      if (_this.props.onTrigger) {
        _this.props.onTrigger();
      }
    }, _this.open = function () {
      _this.clearConfirmationTimeout();
      _this.setState({ opened: true }, function () {
        _this.confirmTimeoutHandle = setTimeout(function () {
          return _this.setState({ opened: false });
        }, _this.props.timeout);
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TimedPopup, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var openOnInit = this.props.openOnInit;

      if (openOnInit) {
        this.open();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearConfirmationTimeout();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          message = _props.message,
          downward = _props.downward;
      var opened = this.state.opened;


      var style = {
        position: 'absolute',
        right: 0
      };
      if (downward) {
        style.top = 0;
      } else {
        style.bottom = 0;
      }

      return opened ? _react2.default.createElement(
        'div',
        { style: { position: 'relative' } },
        _react2.default.createElement(
          'div',
          { className: 'popup', style: style },
          _react2.default.createElement(
            'div',
            { className: 'content' },
            message
          )
        )
      ) : null;
    }
  }]);

  return TimedPopup;
}(_react.Component);

TimedPopup.propTypes = {
  message: _propTypes2.default.string.isRequired,
  downward: _propTypes2.default.bool,
  trigger: _propTypes2.default.object,
  openOnInit: _propTypes2.default.bool,
  timeout: _propTypes2.default.number
};
TimedPopup.defaultProps = {
  downward: false,
  trigger: null,
  openOnInit: false,
  timeout: POPOVER_CONFIRMATION_TIMEOUT
};
exports.default = TimedPopup;
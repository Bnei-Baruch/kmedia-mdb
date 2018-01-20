'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouter = require('react-router');

var _reactCopyToClipboard = require('react-copy-to-clipboard');

var _reactCopyToClipboard2 = _interopRequireDefault(_reactCopyToClipboard);

var _semanticUiReact = require('semantic-ui-react');

var _reactI18next = require('react-i18next');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var POPOVER_CONFIRMATION_TIMEOUT = 2500;

var AVShareLink = function (_Component) {
  _inherits(AVShareLink, _Component);

  function AVShareLink() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AVShareLink);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AVShareLink.__proto__ || Object.getPrototypeOf(AVShareLink)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      url: '',
      recentlyCopied: false
    }, _this.confirmTimeoutHandle = null, _this.loadUrl = function () {
      _this.setState({
        url: window.location.href
      });
    }, _this.clearConfirmationTimeout = function () {
      if (_this.confirmTimeoutHandle) {
        clearTimeout(_this.confirmTimeoutHandle);
        _this.confirmTimeoutHandle = null;
      }
    }, _this.handleCopied = function () {
      _this.clearConfirmationTimeout();
      _this.setState({ recentlyCopied: true }, function () {
        _this.confirmTimeoutHandle = setTimeout(function () {
          return _this.setState({ recentlyCopied: false });
        }, POPOVER_CONFIRMATION_TIMEOUT);
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AVShareLink, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadUrl();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      if (window.location.href !== this.state.url) {
        this.loadUrl();
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
      var t = this.props.t;

      return _react2.default.createElement(_semanticUiReact.Popup, {
        open: this.state.recentlyCopied,
        content: t('messages.link-copied-to-clipboard'),
        position: 'left center',
        offset: 10,
        trigger: _react2.default.createElement(
          _reactCopyToClipboard2.default,
          { text: this.state.url, onCopy: this.handleCopied },
          _react2.default.createElement(_semanticUiReact.Button, {
            type: 'button',
            primary: true,
            size: 'big',
            circular: true,
            icon: 'chain'
          })
        )
      });
    }
  }]);

  return AVShareLink;
}(_react.Component);

AVShareLink.propTypes = {
  t: _propTypes2.default.func.isRequired
};
AVShareLink.defaultProps = {
  downward: false
};
exports.default = (0, _reactRouter.withRouter)((0, _reactI18next.translate)()(AVShareLink));
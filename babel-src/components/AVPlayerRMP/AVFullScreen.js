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

var AVFullscreen = function (_Component) {
  _inherits(AVFullscreen, _Component);

  function AVFullscreen(props) {
    _classCallCheck(this, AVFullscreen);

    var _this = _possibleConstructorReturn(this, (AVFullscreen.__proto__ || Object.getPrototypeOf(AVFullscreen)).call(this, props));

    _this.fullScreenChange = function () {
      _this.setState({ fullScreen: _this.isFullScreenElement() });
    };

    _this.launchIntoFullScreen = function () {
      var container = _this.props.container;

      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    };

    _this.exitFullScreen = function () {
      if (document.exitFullScreen) {
        document.exitFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    };

    _this.isFullScreenElement = function () {
      return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    };

    _this.handleFullscreen = function () {
      if (_this.isFullScreenElement()) {
        _this.exitFullScreen();
      } else {
        _this.launchIntoFullScreen();
      }
    };

    _this.state = {
      fullScreen: false
    };
    return _this;
  }

  _createClass(AVFullscreen, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('fullscreenchange', this.fullScreenChange);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('fullscreenchange', this.fullScreenChange);
    }
  }, {
    key: 'render',
    value: function render() {
      var container = this.props.container;
      var fullScreen = this.state.fullScreen;

      return _react2.default.createElement(
        'button',
        {
          disabled: !container,
          type: 'button',
          className: 'player-button player-control-fullscreen',
          onClick: this.handleFullscreen
        },
        _react2.default.createElement(_semanticUiReact.Icon, { name: fullScreen ? 'compress' : 'expand' })
      );
    }
  }]);

  return AVFullscreen;
}(_react.Component);

AVFullscreen.propTypes = {
  container: _propTypes2.default.instanceOf(_propTypes2.default.Element)
};
AVFullscreen.defaultProps = {
  container: null
};
exports.default = AVFullscreen;
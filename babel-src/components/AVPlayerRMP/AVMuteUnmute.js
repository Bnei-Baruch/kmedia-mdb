'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactMediaPlayer = require('react-media-player');

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AVMuteUnmute = function (_Component) {
  _inherits(AVMuteUnmute, _Component);

  function AVMuteUnmute(props) {
    _classCallCheck(this, AVMuteUnmute);

    var _this = _possibleConstructorReturn(this, (AVMuteUnmute.__proto__ || Object.getPrototypeOf(AVMuteUnmute)).call(this, props));

    _this.setVolume = function (clientY) {
      var media = _this.props.media;

      var _this$element$getBoun = _this.element.getBoundingClientRect(),
          top = _this$element$getBoun.top,
          bottom = _this$element$getBoun.bottom;

      var offset = Math.min(Math.max(0, clientY - top), bottom - top);
      var newVolume = 1 - offset / (bottom - top);
      media.setVolume(newVolume);
    };

    _this.handleMuteUnmute = function () {
      _this.props.media.muteUnmute();
    };

    _this.handleMouseEnter = function () {
      _this.setState({ volumeHover: true });
    };

    _this.handleMouseLeave = function () {
      _this.setState({ volumeHover: false });
    };

    _this.handleStart = function () {
      _this.setState({ wasMouseDown: true });
    };

    _this.handleMove = function (e) {
      if (_this.state.wasMouseDown) {
        // Resolve clientY from mouse or touch event.
        var clientY = e.touches ? e.touches[e.touches.length - 1].clientY : e.clientY;
        _this.setVolume(clientY);
        e.preventDefault();
      }
    };

    _this.handleEnd = function (e) {
      if (_this.state.wasMouseDown) {
        _this.setState({ wasMouseDown: false, volumeHover: false });
        // Seek on desktop on mouse up. On mobile Move is called so no need to setVolume here.
        if (e.clientY) {
          _this.setVolume(e.clientY);
        }
        e.preventDefault();
      }
    };

    _this.normalize = function (l) {
      var ret = 100 * l;
      if (ret < 1) {
        return 0;
      }
      return ret;
    };

    _this.element = null;
    _this.state = {
      volumeHover: false,
      wasMouseDown: false
    };
    return _this;
  }

  // Handle volume change on bar


  _createClass(AVMuteUnmute, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('mousemove', this.handleMove, { passive: false });
      document.addEventListener('touchmove', this.handleMove, { passive: false });
      document.addEventListener('mouseup', this.handleEnd, { passive: false });
      document.addEventListener('touchend', this.handleEnd, { passive: false });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('mousemove', this.handleMove);
      document.removeEventListener('touchmove', this.handleMove);
      document.removeEventListener('mouseup', this.handleEnd);
      document.removeEventListener('touchend', this.handleEnd);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props$media = this.props.media,
          isMuted = _props$media.isMuted,
          volume = _props$media.volume;
      var _state = this.state,
          volumeHover = _state.volumeHover,
          wasMouseDown = _state.wasMouseDown;


      var volumePopoverStyle = {
        position: 'absolute',
        bottom: this.props.upward ? '100%' : 'auto',
        top: this.props.upward ? 'auto' : '100%',
        background: 'black',
        opacity: 0.65,
        visibility: volumeHover || wasMouseDown ? 'visible' : 'hidden'
      };

      var styleVolume = {
        height: this.normalize(volume) + 'px'
      };

      var styleBlank = {
        height: this.normalize(1 - volume) + 'px'
      };

      return _react2.default.createElement(
        'div',
        { className: 'player-control-mute-unmute' },
        _react2.default.createElement(
          'button',
          {
            type: 'button',
            className: 'player-button',
            onClick: this.handleMuteUnmute,
            onMouseEnter: this.handleMouseEnter,
            onMouseLeave: this.handleMouseLeave,
            style: {}
          },
          isMuted && _react2.default.createElement(_semanticUiReact.Icon, {
            key: 'mute',
            name: 'volume off',
            style: { margin: 0, height: '100%' }
          }),
          volume > 0 && volume < 0.5 && _react2.default.createElement(_semanticUiReact.Icon, {
            key: 'volume-down',
            name: 'volume down',
            style: { margin: 0, height: '100%' }
          }),
          volume >= 0.5 && _react2.default.createElement(_semanticUiReact.Icon, {
            key: 'volume-up',
            name: 'volume up',
            style: { margin: 0, height: '100%' }
          })
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'volume-popover',
            style: volumePopoverStyle,
            onMouseEnter: this.handleMouseEnter,
            onMouseLeave: this.handleMouseLeave
          },
          _react2.default.createElement(
            'div',
            {
              ref: function ref(c) {
                _this2.element = c;
              },
              className: 'bar-wrapper',
              role: 'button',
              tabIndex: '0',
              onMouseDown: this.handleStart,
              onTouchStart: this.handleStart
            },
            _react2.default.createElement(
              'div',
              { className: 'bar volume', style: styleVolume },
              _react2.default.createElement('div', { className: 'knob' })
            ),
            _react2.default.createElement('div', { className: 'bar blank', style: styleBlank })
          )
        )
      );
    }
  }]);

  return AVMuteUnmute;
}(_react.Component);

AVMuteUnmute.propTypes = {
  media: _propTypes2.default.shape({
    isMuted: _propTypes2.default.bool.isRequired,
    volume: _propTypes2.default.number.isRequired,
    muteUnmute: _propTypes2.default.func.isRequired,
    setVolume: _propTypes2.default.func.isRequired
  }).isRequired,
  upward: _propTypes2.default.bool
};
AVMuteUnmute.defaultProps = {
  upward: true
};
exports.default = (0, _reactMediaPlayer.withMediaProps)(AVMuteUnmute);
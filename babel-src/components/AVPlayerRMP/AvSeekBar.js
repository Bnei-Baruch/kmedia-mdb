'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isNumber = require('lodash/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _reactMediaPlayer = require('react-media-player');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _constants = require('./constants');

var _propTypes3 = require('./propTypes');

var _SliceHandle = require('./SliceHandle');

var _SliceHandle2 = _interopRequireDefault(_SliceHandle);

var _time = require('../../helpers/time');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stickyHandleDelta = 10; // pixel width from which to stick to handle
var minSliceAreaWidth = '1%';

var AvSeekBar = function (_Component) {
  _inherits(AvSeekBar, _Component);

  function AvSeekBar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AvSeekBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AvSeekBar.__proto__ || Object.getPrototypeOf(AvSeekBar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      seekbarHadInteraction: false,
      playPoint: _this.props.media.currentTime
    }, _this.getSeekPositionFromClientX = function (clientX) {
      var _this$props = _this.props,
          media = _this$props.media,
          playerMode = _this$props.playerMode,
          sliceStart = _this$props.sliceStart,
          sliceEnd = _this$props.sliceEnd;

      var _this$element$getBoun = _this.element.getBoundingClientRect(),
          left = _this$element$getBoun.left,
          right = _this$element$getBoun.right;

      var duration = media.duration;

      var offset = Math.min(Math.max(0, clientX - left), right - left);

      if (playerMode === _constants.PLAYER_MODE.SLICE_EDIT) {
        // try stick to handle
        if (_this.sliceStartHandle && _this.sliceEndHandle) {
          var _this$sliceStartHandl = _this.sliceStartHandle.getHandleElement().getBoundingClientRect(),
              startLeft = _this$sliceStartHandl.left;

          var _this$sliceEndHandle$ = _this.sliceEndHandle.getHandleElement().getBoundingClientRect(),
              endLeft = _this$sliceEndHandle$.left;

          var sliceWidth = endLeft - startLeft;
          // reduce delta if slice is small
          var fittedStickyDelta = stickyHandleDelta * 2.5 > sliceWidth ? sliceWidth / 4 : stickyHandleDelta;
          if (Math.abs(clientX - startLeft) < fittedStickyDelta) {
            return sliceStart;
          }

          if (Math.abs(clientX - endLeft) < fittedStickyDelta) {
            return sliceEnd > duration ? duration : sliceEnd;
          }
        }
      }

      return duration * offset / (right - left);
    }, _this.getNormalizedSliceStart = function (duration) {
      var sliceEnd = _this.props.sliceEnd;
      var sliceStart = _this.props.sliceStart;

      if (!(0, _isNumber2.default)(sliceStart)) {
        return 0;
      }

      if (sliceStart > sliceEnd) {
        sliceStart = sliceEnd;
      }

      if (duration < sliceStart) {
        sliceStart = duration;
      }

      if (sliceStart < 0) {
        sliceStart = 0;
      }

      return sliceStart / duration;
    }, _this.getNormalizedSliceEnd = function (duration) {
      var sliceStart = _this.props.sliceStart;
      var sliceEnd = _this.props.sliceEnd;


      if (!(0, _isNumber2.default)(sliceEnd)) {
        return 1;
      }

      if (sliceEnd < sliceStart) {
        sliceEnd = sliceStart;
      }

      if (sliceEnd > duration) {
        sliceEnd = duration;
      }

      if (sliceEnd < 0) {
        sliceEnd = 0;
      }

      return sliceEnd / duration;
    }, _this.element = null, _this.wasMouseDown = false, _this.isPlayingOnMouseDown = false, _this.toPercentage = function (l) {
      var ret = 100 * l;
      if (ret > 100) {
        return '100%';
      }
      return ret < 1 ? 0 : ret + '%';
    }, _this.handleStart = function (e) {
      // regard only left mouse button click (0). touch is undefined
      if (e.button) {
        e.preventDefault();
        return;
      }

      _this.wasMouseDown = true;
      _this.isPlayingOnMouseDown = _this.props.media.isPlaying;

      _this.props.media.pause();

      if (_this.sliceStartHandle && e.target === _this.sliceStartHandle.getKnobElement()) {
        _this.sliceStartActive = true;
      } else if (_this.sliceEndHandle && e.target === _this.sliceEndHandle.getKnobElement()) {
        _this.sliceEndActive = true;
      } else {
        _this.sliceStartActive = false;
        _this.sliceEndActive = false;
      }

      if (!_this.state.seekbarHadInteraction) {
        _this.setState({ seekbarHadInteraction: true });
      }
    }, _this.handleMove = function (e) {
      var _this$props2 = _this.props,
          onSliceStartChange = _this$props2.onSliceStartChange,
          onSliceEndChange = _this$props2.onSliceEndChange,
          sliceStart = _this$props2.sliceStart,
          sliceEnd = _this$props2.sliceEnd,
          media = _this$props2.media;

      if (_this.wasMouseDown) {
        e.preventDefault();
        // Resolve clientX from mouse or touch event.
        var clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
        _this.touchClientX = clientX; // this is stored for touch because touchend has no coords
        var seekPosition = _this.getSeekPositionFromClientX(clientX);

        if (_this.sliceStartActive) {
          if (seekPosition < sliceEnd) {
            onSliceStartChange(seekPosition);
          }
        } else if (_this.sliceEndActive) {
          if (seekPosition > sliceStart) {
            onSliceEndChange(seekPosition);
          }
        }

        media.seekTo(seekPosition);
      }
    }, _this.handleEnd = function (e) {
      var media = _this.props.media;

      if (_this.wasMouseDown) {
        e.preventDefault();
        _this.wasMouseDown = false;

        var clientX = e.clientX || _this.touchClientX;

        if (typeof clientX !== 'undefined') {
          // pause when dragging handles
          if (_this.sliceStartActive === true || _this.sliceEndActive === true) {
            _this.props.media.pause();
          }

          var seekPosition = _this.getSeekPositionFromClientX(clientX);
          media.seekTo(seekPosition);
          _this.setState({ playPoint: seekPosition });
        }

        // only play if media was playing prior to mouseDown
        if (!_this.sliceStartActive && !_this.sliceEndActive && _this.isPlayingOnMouseDown) {
          _this.props.media.play();
        }

        _this.sliceStartActive = false;
        _this.sliceEndActive = false;
        _this.touchClientX = undefined;
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AvSeekBar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('mousemove', this.handleMove, { passive: false });
      document.addEventListener('touchmove', this.handleMove, { passive: false });
      document.addEventListener('mouseup', this.handleEnd, { passive: false });
      document.addEventListener('touchend', this.handleEnd, { passive: false });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!this.sliceStartActive && !this.sliceEndActive && this.props.media.currentTime !== nextProps.media.currentTime) {
        this.setState({ playPoint: nextProps.media.currentTime });
      }
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

      var _props = this.props,
          isMobile = _props.isMobile,
          sliceStart = _props.sliceStart,
          sliceEnd = _props.sliceEnd;
      var _props$media = this.props.media,
          currentTime = _props$media.currentTime,
          duration = _props$media.duration;

      var current = this.state.playPoint / duration;
      // Overriding progress of native react-media-player as he does not works correctly
      // with buffers.
      var _props2 = this.props,
          buffers = _props2.buffers,
          playerMode = _props2.playerMode;

      var buf = buffers.find(function (b) {
        return b.start <= currentTime && b.end >= currentTime;
      });
      var progress = buf && buf.end / duration;

      var isSliceEdit = playerMode === _constants.PLAYER_MODE.SLICE_EDIT;
      var isSliceView = playerMode === _constants.PLAYER_MODE.SLICE_VIEW;
      var isSlice = isSliceEdit || isSliceView;
      var normalizedSliceStart = this.getNormalizedSliceStart(duration);
      var normalizedSliceEnd = this.getNormalizedSliceEnd(duration);

      var playedLeft = 0;
      if (isSliceView && !this.state.seekbarHadInteraction) {
        playedLeft = normalizedSliceStart;
      }
      var playedWidth = Math.max(0, current - playedLeft);

      var stylePlayed = {
        left: this.toPercentage(playedLeft),
        width: this.toPercentage(playedWidth)
      };

      var stylePlayedKnob = {
        left: this.toPercentage(playedLeft + playedWidth)
      };

      var styleLoaded = {
        width: this.toPercentage(progress),
        left: 0
      };

      var sliceStartLeft = this.toPercentage(normalizedSliceStart);
      var sliceEndLeft = this.toPercentage(normalizedSliceEnd);

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(el) {
            _this2.element = el;
          },
          className: 'player-control-seekbar-container',
          onMouseDown: this.handleStart,
          onTouchStart: this.handleStart,
          role: 'button',
          tabIndex: '0'
        },
        isSliceEdit && _react2.default.createElement(_SliceHandle2.default, {
          ref: function ref(el) {
            _this2.sliceStartHandle = el;
          },
          seconds: (0, _time.formatTime)(sliceStart),
          position: sliceStartLeft,
          isEditMode: playerMode === _constants.PLAYER_MODE.SLICE_EDIT
        }),
        isSliceEdit && _react2.default.createElement(_SliceHandle2.default, {
          ref: function ref(el) {
            _this2.sliceEndHandle = el;
          },
          seconds: (0, _time.formatTime)(sliceEnd === Infinity ? duration : sliceEnd),
          position: sliceEndLeft,
          isEditMode: playerMode === _constants.PLAYER_MODE.SLICE_EDIT
        }),
        _react2.default.createElement(
          'div',
          { className: 'player-control-seekbar' },
          isSlice && _react2.default.createElement('div', {
            className: 'player-slice-area',
            style: {
              left: sliceStartLeft,
              width: Math.max(minSliceAreaWidth, this.toPercentage(normalizedSliceEnd - normalizedSliceStart))
            }
          }),
          _react2.default.createElement('div', { className: (0, _classnames2.default)('bar', 'empty', { mobile: isMobile }) }),
          _react2.default.createElement('div', { className: (0, _classnames2.default)('bar', 'played', { mobile: isMobile }), style: stylePlayed }),
          _react2.default.createElement('div', { className: (0, _classnames2.default)('played-knob', { mobile: isMobile }), style: stylePlayedKnob }),
          _react2.default.createElement('div', { className: (0, _classnames2.default)('bar', 'loaded', { mobile: isMobile }), style: styleLoaded })
        )
      );
    }
  }]);

  return AvSeekBar;
}(_react.Component);

AvSeekBar.propTypes = {
  media: _propTypes2.default.object.isRequired, // TODO: (yaniv) use right propType
  buffers: _propTypes2.default.array,
  playerMode: _propTypes3.playerModeProp.isRequired,
  sliceStart: _propTypes2.default.number,
  sliceEnd: _propTypes2.default.number,
  onSliceStartChange: _propTypes2.default.func,
  onSliceEndChange: _propTypes2.default.func,
  isMobile: _propTypes2.default.bool.isRequired
};
AvSeekBar.defaultProps = {
  buffers: [],
  sliceStart: 0,
  sliceEnd: Infinity,
  onSliceStartChange: _noop2.default,
  onSliceEndChange: _noop2.default
};
exports.default = (0, _reactMediaPlayer.withMediaProps)(AvSeekBar);
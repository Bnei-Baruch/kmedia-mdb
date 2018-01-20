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

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _reactRouterDom = require('react-router-dom');

var _reactMediaPlayer = require('react-media-player');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactVirtualized = require('react-virtualized');

var _semanticUiReact = require('semantic-ui-react');

var _withIsMobile = require('../../helpers/withIsMobile');

var _withIsMobile2 = _interopRequireDefault(_withIsMobile);

var _url = require('../../helpers/url');

var _consts = require('../../helpers/consts');

var _constants = require('./constants');

var _AVPlayPause = require('./AVPlayPause');

var _AVPlayPause2 = _interopRequireDefault(_AVPlayPause);

var _AVPlaybackRate = require('./AVPlaybackRate');

var _AVPlaybackRate2 = _interopRequireDefault(_AVPlaybackRate);

var _AVCenteredPlay = require('./AVCenteredPlay');

var _AVCenteredPlay2 = _interopRequireDefault(_AVCenteredPlay);

var _AVTimeElapsed = require('./AVTimeElapsed');

var _AVTimeElapsed2 = _interopRequireDefault(_AVTimeElapsed);

var _AVFullScreen = require('./AVFullScreen');

var _AVFullScreen2 = _interopRequireDefault(_AVFullScreen);

var _AVMuteUnmute = require('./AVMuteUnmute');

var _AVMuteUnmute2 = _interopRequireDefault(_AVMuteUnmute);

var _AVLanguage = require('./AVLanguage');

var _AVLanguage2 = _interopRequireDefault(_AVLanguage);

var _AVAudioVideo = require('./AVAudioVideo');

var _AVAudioVideo2 = _interopRequireDefault(_AVAudioVideo);

var _AvSeekBar = require('./AvSeekBar');

var _AvSeekBar2 = _interopRequireDefault(_AvSeekBar);

var _AVEditSlice = require('./AVEditSlice');

var _AVEditSlice2 = _interopRequireDefault(_AVEditSlice);

var _AVShareBar = require('./AVShareBar');

var _AVShareBar2 = _interopRequireDefault(_AVShareBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PLAYER_VOLUME_STORAGE_KEY = '@@kmedia_player_volume';
var DEFAULT_PLAYER_VOLUME = 0.8;

// Converts playback rate string to float: 1.0x => 1.0
var playbackToValue = function playbackToValue(playback) {
  return parseFloat(playback.slice(0, -1));
};

var AVPlayerRMP = function (_PureComponent) {
  _inherits(AVPlayerRMP, _PureComponent);

  function AVPlayerRMP() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AVPlayerRMP);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AVPlayerRMP.__proto__ || Object.getPrototypeOf(AVPlayerRMP)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      isTopSeekbar: false,
      controlsVisible: true,
      error: false,
      errorReason: '',
      playbackRate: '1x', // this is used only to rerender the component. actual value is saved on the player's instance
      mode: _constants.PLAYER_MODE.NORMAL,
      persistenceFn: _noop2.default
    }, _this.activatePersistence = function () {
      _this.setState({ persistenceFn: _this.persistVolume });
      var persistedVolume = localStorage.getItem(PLAYER_VOLUME_STORAGE_KEY);

      if (persistedVolume == null || isNaN(persistedVolume)) {
        persistedVolume = DEFAULT_PLAYER_VOLUME;
        localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, persistedVolume);
      }
      _this.props.media.setVolume(persistedVolume);
    }, _this.persistVolume = (0, _debounce2.default)(function (media) {
      return localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, media.volume);
    }, 200), _this.onSwitchAV = function () {
      for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      var _this$props = _this.props,
          onSwitchAV = _this$props.onSwitchAV,
          _this$props$media = _this$props.media,
          currentTime = _this$props$media.currentTime,
          isPlaying = _this$props$media.isPlaying;

      _this.setState({ wasCurrentTime: currentTime, wasPlaying: isPlaying }, function () {
        onSwitchAV.apply(undefined, params);
      });
    }, _this.onLanguageChange = function () {
      for (var _len3 = arguments.length, params = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        params[_key3] = arguments[_key3];
      }

      var _this$props2 = _this.props,
          onLanguageChange = _this$props2.onLanguageChange,
          _this$props2$media = _this$props2.media,
          currentTime = _this$props2$media.currentTime,
          isPlaying = _this$props2$media.isPlaying;

      _this.setState({ wasCurrentTime: currentTime, wasPlaying: isPlaying }, function () {
        onLanguageChange.apply(undefined, params);
      });
    }, _this.onPlayerReady = function () {
      var _this$state = _this.state,
          wasCurrentTime = _this$state.wasCurrentTime,
          wasPlaying = _this$state.wasPlaying;
      var media = _this.props.media;


      _this.activatePersistence();

      if (wasCurrentTime) {
        media.seekTo(wasCurrentTime);
      }
      if (wasPlaying) {
        media.play();
      }

      // restore playback from state when player instance changed (when src changes, e.g., playlist).
      _this.player.instance.playbackRate = playbackToValue(_this.state.playbackRate);
      _this.setState({ wasCurrentTime: undefined, wasPlaying: undefined });
    }, _this.onError = function (e) {
      var t = _this.props.t;
      // Show error only on loading of video.

      if (!e.currentTime && !e.isPlaying) {
        var item = _this.props.item;

        var errorReason = '';
        if (item.src.endsWith('wmv') || item.src.endsWith('flv')) {
          errorReason = t('messages.unsupported-media-format');
        } else {
          errorReason = t('messages.unknown');
        }
        _this.setState({ error: true, errorReason: errorReason });
      }
    }, _this.onPlay = function () {
      if (_this.props.onPlay) {
        _this.props.onPlay();
      }
    }, _this.onPause = function (e) {
      // when we're close to the end regard this as finished
      if (Math.abs(e.currentTime - e.duration) < 0.1 && _this.props.onFinish) {
        _this.props.onFinish();
      } else if (_this.props.onPause) {
        _this.props.onPause();
      }
    }, _this.onKeyDown = function (e) {
      if (e.keyCode === 32) {
        _this.props.media.playPause();
        e.preventDefault();
      }
    }, _this.onSeekBarResize = function (_ref2) {
      var width = _ref2.width;

      var MIN_SEEKBAR_SIZE = 100;
      if (_this.state.isTopSeekbar !== width < MIN_SEEKBAR_SIZE) {
        _this.setState({ isTopSeekbar: width < MIN_SEEKBAR_SIZE });
      }
    }, _this.setSliceMode = function (isEdit) {
      var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cb = arguments[2];

      var sliceStart = properties.sliceStart;
      var sliceEnd = properties.sliceEnd;
      var media = _this.props.media;


      if (isEdit) {
        media.pause();
      }

      if (typeof sliceStart === 'undefined') {
        sliceStart = _this.state.sliceStart || 0;
      }

      if (typeof sliceEnd === 'undefined') {
        sliceEnd = _this.state.sliceEnd || media.duration || Infinity;
      }
      _this.setState(Object.assign({
        mode: isEdit ? _constants.PLAYER_MODE.SLICE_EDIT : _constants.PLAYER_MODE.SLICE_VIEW
      }, properties, {
        sliceStart: sliceStart,
        sliceEnd: sliceEnd
      }), cb);
    }, _this.setNormalMode = function (cb) {
      return _this.setState({
        mode: _constants.PLAYER_MODE.NORMAL,
        sliceStart: undefined,
        sliceEnd: undefined
      }, cb);
    }, _this.handleTimeUpdate = function (timeData) {
      var media = _this.props.media;
      var _this$state2 = _this.state,
          mode = _this$state2.mode,
          sliceEnd = _this$state2.sliceEnd;


      var isSliceMode = mode === _constants.PLAYER_MODE.SLICE_EDIT || mode === _constants.PLAYER_MODE.SLICE_VIEW;

      var lowerTime = Math.min(sliceEnd, timeData.currentTime);
      if (isSliceMode && lowerTime < sliceEnd && sliceEnd - lowerTime < 0.5) {
        media.pause();
        media.seekTo(sliceEnd);
      }
    }, _this.handleToggleMode = function () {
      var mode = _this.state.mode;


      if (mode === _constants.PLAYER_MODE.SLICE_EDIT || mode === _constants.PLAYER_MODE.SLICE_VIEW) {
        _this.setNormalMode(_this.resetSliceQuery);
      } else {
        _this.setSliceMode(_this.updateSliceQuery);
      }
    }, _this.handleSliceEndChange = function (value) {
      var newState = {
        sliceEnd: value
      };
      _this.setState(newState);
      _this.updateSliceQuery(newState);
    }, _this.handleSliceStartChange = function (value) {
      var newState = {
        sliceStart: value
      };
      _this.setState(newState);
      _this.updateSliceQuery(newState);
    }, _this.resetSliceQuery = function () {
      var history = _this.props.history;

      var query = (0, _url.parse)(history.location.search.slice(1));
      query.sstart = undefined;
      query.send = undefined;
      history.replace({ search: (0, _url.stringify)(query) });
    }, _this.buffers = function () {
      var videoElement = _this.player && _this.player.instance;
      var ret = [];
      if (videoElement) {
        for (var idx = 0; idx < videoElement.buffered.length; ++idx) {
          ret.push({
            start: videoElement.buffered.start(idx),
            end: videoElement.buffered.end(idx)
          });
        }
      }
      return ret;
    }, _this.updateSliceQuery = function (values) {
      var _this$props3 = _this.props,
          history = _this$props3.history,
          media = _this$props3.media;
      var _this$state3 = _this.state,
          sliceStart = _this$state3.sliceStart,
          sliceEnd = _this$state3.sliceEnd;


      var query = (0, _url.parse)(history.location.search.slice(1));
      if (!values) {
        query.sstart = sliceStart || 0;
        query.send = !sliceEnd || sliceEnd === Infinity ? media.duration : sliceEnd;
      } else {
        if (typeof values.sliceEnd !== 'undefined') {
          query.send = +values.sliceEnd.toFixed(3);
        }

        if (typeof values.sliceStart !== 'undefined') {
          query.sstart = +values.sliceStart.toFixed(3);
        }
      }

      history.replace({ search: (0, _url.stringify)(query) });
    }, _this.showControls = function (callback) {
      if (_this.autohideTimeoutId) {
        clearTimeout(_this.autohideTimeoutId);
        _this.autohideTimeoutId = null;
      }
      _this.setState({ controlsVisible: true }, callback);
    }, _this.hideControlsTimeout = function () {
      if (!_this.autohideTimeoutId) {
        _this.autohideTimeoutId = setTimeout(function () {
          _this.setState({ controlsVisible: false });
        }, 2000);
      }
    }, _this.controlsEnter = function () {
      _this.showControls();
    }, _this.centerMove = function () {
      var isMobile = _this.props.isMobile;

      if (!isMobile) {
        _this.showControls(function () {
          return _this.hideControlsTimeout();
        });
      }
    }, _this.controlsLeave = function () {
      _this.hideControlsTimeout();
    }, _this.playbackRateChange = function (e, rate) {
      _this.player.instance.playbackRate = playbackToValue(rate);
      _this.setState({ playbackRate: rate });
    }, _this.playPause = function () {
      var _this$props4 = _this.props,
          isMobile = _this$props4.isMobile,
          playPause = _this$props4.media.playPause;


      if (isMobile && !_this.state.controlsVisible) {
        _this.showControls(function () {
          return _this.hideControlsTimeout();
        });
      } else {
        playPause();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AVPlayerRMP, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props,
          isSliceable = _props.isSliceable,
          history = _props.history;


      if (isSliceable) {
        var query = (0, _url.parse)(history.location.search.slice(1));

        if (query.sstart || query.send) {
          this.setSliceMode(!!query.sliceEdit, {
            sliceStart: query.sstart ? parseFloat(query.sstart) : 0,
            sliceEnd: query.send ? parseFloat(query.send) : Infinity
          });
        }
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      // By default hide controls after a while if player playing.
      this.hideControlsTimeout();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.item !== this.props.item) {
        this.setState({ error: false, errorReason: '' });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.autohideTimeoutId) {
        clearTimeout(this.autohideTimeoutId);
        this.autohideTimeoutId = null;
      }
    }

    // Remember the current time and isPlaying while switching.


    // Remember the current time and isPlaying while switching.


    // Correctly fetch loaded buffers from video to show loading progress.
    // This code should be ported to react-media-player.

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          isMobile = _props2.isMobile,
          autoPlay = _props2.autoPlay,
          item = _props2.item,
          languages = _props2.languages,
          language = _props2.language,
          t = _props2.t,
          showNextPrev = _props2.showNextPrev,
          hasNext = _props2.hasNext,
          hasPrev = _props2.hasPrev,
          onPrev = _props2.onPrev,
          onNext = _props2.onNext,
          media = _props2.media,
          isSliceable = _props2.isSliceable;
      var _state = this.state,
          isTopSeekbar = _state.isTopSeekbar,
          controlsVisible = _state.controlsVisible,
          sliceStart = _state.sliceStart,
          sliceEnd = _state.sliceEnd,
          mode = _state.mode,
          playbackRate = _state.playbackRate;
      var _state2 = this.state,
          error = _state2.error,
          errorReason = _state2.errorReason;
      var isFullscreen = media.isFullscreen,
          isPlaying = media.isPlaying;

      var forceShowControls = item.mediaType === _consts.MT_AUDIO || !isPlaying;

      var isVideo = item.mediaType === _consts.MT_VIDEO;
      var isAudio = item.mediaType === _consts.MT_AUDIO;
      var isEditMode = mode === _constants.PLAYER_MODE.SLICE_EDIT;
      var fallbackMedia = item.mediaType !== item.requestedMediaType;

      if (!item.src) {
        error = true;
        errorReason = t('messages.no-playable-files');
      }

      var centerMediaControl = void 0;
      if (error) {
        centerMediaControl = _react2.default.createElement(
          'div',
          { className: 'player-button' },
          t('player.error.loading'),
          errorReason ? ' ' + errorReason : '',
          '\xA0',
          _react2.default.createElement(_semanticUiReact.Icon, { name: 'warning sign', size: 'large' })
        );
      } else if (isEditMode) {
        centerMediaControl = _react2.default.createElement(
          'div',
          { className: 'center-media-controls-edit' },
          _react2.default.createElement(_semanticUiReact.Button, {
            icon: 'chevron left',
            content: t('player.buttons.edit-back'),
            size: 'large',
            color: 'blue',
            className: 'button-close-slice-edit',
            onClick: this.handleToggleMode
          }),
          _react2.default.createElement(
            'div',
            { className: 'slice-edit-help' },
            t('player.messages.edit-help')
          ),
          _react2.default.createElement(_AVShareBar2.default, null)
        );
      } else if (isVideo) {
        centerMediaControl = _react2.default.createElement(_AVCenteredPlay2.default, null);
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          {
            ref: function ref(c) {
              _this2.mediaElement = c;
            },
            className: (0, _classnames2.default)('media', { 'media-edit-mode': isEditMode }),
            style: {
              minHeight: isAudio ? 200 : 40,
              minWidth: isVideo ? 380 : 'auto'
            }
          },
          _react2.default.createElement(
            'div',
            {
              className: (0, _classnames2.default)('media-player', {
                'media-player-fullscreen': isFullscreen,
                fade: !controlsVisible && !forceShowControls,
                'audio-is-mobile': isTopSeekbar && isAudio,
                'video-is-mobile': isTopSeekbar && isVideo
              })
            },
            _react2.default.createElement(_reactMediaPlayer.Player, {
              ref: function ref(c) {
                _this2.player = c;
              },
              onVolumeChange: this.state.persistenceFn,
              src: item.src,
              vendor: isVideo ? 'video' : 'audio',
              autoPlay: autoPlay,
              onReady: this.onPlayerReady,
              preload: 'auto',
              onError: this.onError,
              onPause: this.onPause,
              onPlay: this.onPlay,
              onTimeUpdate: this.handleTimeUpdate,
              defaultCurrentTime: sliceStart || 0
            }),
            _react2.default.createElement(
              'div',
              {
                className: (0, _classnames2.default)('media-controls', {
                  fade: !controlsVisible && !forceShowControls,
                  'audio-is-mobile': isTopSeekbar && isAudio,
                  'video-is-mobile': isTopSeekbar && isVideo
                })
              },
              _react2.default.createElement(
                'div',
                {
                  className: 'controls-wrapper',
                  onMouseEnter: this.controlsEnter,
                  onMouseLeave: this.controlsLeave
                },
                _react2.default.createElement(
                  'div',
                  { className: 'controls-container' },
                  !isTopSeekbar ? null : _react2.default.createElement(
                    'div',
                    { style: {
                        position: 'absolute',
                        flex: '1 0 auto',
                        left: 0,
                        top: isMobile ? '-10px' : 0,
                        width: '100%'
                      }
                    },
                    _react2.default.createElement(_AvSeekBar2.default, {
                      buffers: this.buffers(),
                      playerMode: mode,
                      sliceStart: sliceStart,
                      sliceEnd: sliceEnd,
                      onSliceStartChange: this.handleSliceStartChange,
                      onSliceEndChange: this.handleSliceEndChange,
                      isMobile: isMobile
                    })
                  ),
                  _react2.default.createElement(_AVPlayPause2.default, {
                    showNextPrev: showNextPrev && !isEditMode,
                    hasNext: hasNext,
                    hasPrev: hasPrev,
                    onPrev: onPrev,
                    onNext: onNext
                  }),
                  _react2.default.createElement(_AVTimeElapsed2.default, {
                    start: media.currentTime,
                    end: media.duration
                  }),
                  _react2.default.createElement(
                    'div',
                    { className: 'player-seekbar-wrapper' },
                    _react2.default.createElement(
                      _reactVirtualized.AutoSizer,
                      { onResize: this.onSeekBarResize },
                      function () {
                        return null;
                      }
                    ),
                    isTopSeekbar ? null : _react2.default.createElement(_AvSeekBar2.default, {
                      buffers: this.buffers(),
                      playerMode: mode,
                      sliceStart: sliceStart,
                      sliceEnd: sliceEnd,
                      onSliceStartChange: this.handleSliceStartChange,
                      onSliceEndChange: this.handleSliceEndChange,
                      isMobile: isMobile
                    })
                  ),
                  !isEditMode && _react2.default.createElement(_AVPlaybackRate2.default, {
                    value: playbackRate,
                    onSelect: this.playbackRateChange,
                    upward: isVideo
                  }),
                  _react2.default.createElement(_AVMuteUnmute2.default, { upward: isVideo }),
                  !isEditMode && _react2.default.createElement(_AVAudioVideo2.default, {
                    isAudio: isAudio,
                    isVideo: isVideo,
                    setAudio: this.onSwitchAV,
                    setVideo: this.onSwitchAV,
                    fallbackMedia: fallbackMedia,
                    t: t
                  }),
                  !isEditMode && _react2.default.createElement(_AVLanguage2.default, {
                    languages: languages,
                    language: language,
                    requestedLanguage: item.requestedLanguage,
                    onSelect: this.onLanguageChange,
                    upward: isVideo,
                    t: t
                  }),
                  isSliceable && !isEditMode && _react2.default.createElement(_AVEditSlice2.default, { onActivateSlice: function onActivateSlice() {
                      return _this2.setSliceMode(true);
                    } }),
                  !isEditMode && !isAudio && _react2.default.createElement(_AVFullScreen2.default, { container: this.mediaElement })
                )
              ),
              _react2.default.createElement(
                'div',
                {
                  className: 'media-center-control',
                  style: !error ? { outline: 'none' } : { backgroundColor: 'black', outline: 'none' },
                  role: 'button',
                  tabIndex: '0',
                  onClick: this.playPause,
                  onKeyDown: this.onKeyDown,
                  onMouseMove: this.centerMove
                },
                centerMediaControl
              )
            )
          )
        )
      );
    }
  }]);

  return AVPlayerRMP;
}(_react.PureComponent);

AVPlayerRMP.propTypes = {
  t: _propTypes2.default.func.isRequired,
  media: _propTypes2.default.object.isRequired,
  isMobile: _propTypes2.default.bool.isRequired,

  // Language dropdown props.
  languages: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
  language: _propTypes2.default.string.isRequired,
  onLanguageChange: _propTypes2.default.func.isRequired,

  // Audio/Video switch props.
  item: _propTypes2.default.object.isRequired, // TODO: (yaniv) add shape fo this
  onSwitchAV: _propTypes2.default.func.isRequired,

  // Slice props
  isSliceable: _propTypes2.default.bool,
  history: _propTypes2.default.object.isRequired,

  // Playlist props
  autoPlay: _propTypes2.default.bool,
  showNextPrev: _propTypes2.default.bool,
  hasNext: _propTypes2.default.bool,
  hasPrev: _propTypes2.default.bool,
  onFinish: _propTypes2.default.func,
  onPlay: _propTypes2.default.func,
  onPause: _propTypes2.default.func,
  onPrev: _propTypes2.default.func,
  onNext: _propTypes2.default.func
};
AVPlayerRMP.defaultProps = {
  isSliceable: false,
  autoPlay: false,
  showNextPrev: false,
  hasNext: false,
  hasPrev: false,
  onFinish: _noop2.default,
  onPlay: _noop2.default,
  onPause: _noop2.default,
  onPrev: _noop2.default,
  onNext: _noop2.default
};
exports.default = (0, _withIsMobile2.default)((0, _reactMediaPlayer.withMediaProps)((0, _reactRouterDom.withRouter)(AVPlayerRMP)));
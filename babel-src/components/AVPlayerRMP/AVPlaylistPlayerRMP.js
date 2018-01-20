'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactMediaPlayer = require('react-media-player');

var _consts = require('../../helpers/consts');

var _AVPlayerRMP = require('./AVPlayerRMP');

var _AVPlayerRMP2 = _interopRequireDefault(_AVPlayerRMP);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AVPlaylistPlayerRMP = function (_Component) {
  _inherits(AVPlaylistPlayerRMP, _Component);

  function AVPlaylistPlayerRMP() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AVPlaylistPlayerRMP);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AVPlaylistPlayerRMP.__proto__ || Object.getPrototypeOf(AVPlaylistPlayerRMP)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      autoPlay: false
    }, _this.onFinish = function () {
      var _this$props = _this.props,
          activePart = _this$props.activePart,
          onActivePartChange = _this$props.onActivePartChange,
          playlist = _this$props.playlist;

      if (activePart < playlist.items.length - 1) {
        onActivePartChange(activePart + 1);
      }
      _this.setState({ autoPlay: true });
    }, _this.onNext = function () {
      var _this$props2 = _this.props,
          activePart = _this$props2.activePart,
          onActivePartChange = _this$props2.onActivePartChange,
          playlist = _this$props2.playlist;

      if (activePart < playlist.items.length - 1) {
        onActivePartChange(activePart + 1);
      }
    }, _this.onPrev = function () {
      var _this$props3 = _this.props,
          activePart = _this$props3.activePart,
          onActivePartChange = _this$props3.onActivePartChange;

      if (activePart > 0) {
        onActivePartChange(activePart - 1);
      }
    }, _this.onPlay = function () {
      return _this.setState({ autoPlay: true });
    }, _this.onPause = function () {
      return _this.setState({ autoPlay: false });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AVPlaylistPlayerRMP, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          t = _props.t,
          activePart = _props.activePart,
          playlist = _props.playlist,
          onSwitchAV = _props.onSwitchAV,
          onLanguageChange = _props.onLanguageChange;
      var autoPlay = this.state.autoPlay;


      var items = playlist.items;
      var currentItem = items[activePart];

      // hasNext, hasPrev are not trivial as checking the indexes due to fact
      // that in some languages there might be missing audio or video file.
      var hasNext = activePart < items.length - 1 && items.slice(activePart).some(function (f) {
        return !!f.src;
      });
      var hasPrev = activePart > 0 && items.slice(0, activePart).some(function (f) {
        return !!f.src;
      });

      return _react2.default.createElement(
        'div',
        {
          /* FIXME(yaniv): need to be in css */
          className: (0, _classnames2.default)('avbox__player', { audio: currentItem.mediaType === _consts.MT_AUDIO }),
          style: { height: 'initial', paddingTop: '15px' }
        },
        _react2.default.createElement(
          'div',
          { className: 'avbox__media-wrapper', style: { position: 'relative' } },
          _react2.default.createElement(
            _reactMediaPlayer.Media,
            null,
            _react2.default.createElement(_AVPlayerRMP2.default, {
              autoPlay: autoPlay,
              item: currentItem,
              onSwitchAV: onSwitchAV,
              languages: currentItem.availableLanguages,
              language: playlist.language,
              onLanguageChange: onLanguageChange,
              t: t
              // Playlist props
              , showNextPrev: true,
              onFinish: this.onFinish,
              hasNext: hasNext,
              hasPrev: hasPrev,
              onPrev: this.onPrev,
              onNext: this.onNext,
              onPause: this.onPause,
              onPlay: this.onPlay
            })
          )
        )
      );
    }
  }]);

  return AVPlaylistPlayerRMP;
}(_react.Component);

AVPlaylistPlayerRMP.propTypes = {
  playlist: _propTypes2.default.object.isRequired,
  activePart: _propTypes2.default.number.isRequired,
  onActivePartChange: _propTypes2.default.func.isRequired,
  onLanguageChange: _propTypes2.default.func.isRequired,
  onSwitchAV: _propTypes2.default.func.isRequired,
  t: _propTypes2.default.func.isRequired
};
exports.default = AVPlaylistPlayerRMP;
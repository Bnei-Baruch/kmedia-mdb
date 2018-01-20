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

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AVCenteredPlay = function (_Component) {
  _inherits(AVCenteredPlay, _Component);

  function AVCenteredPlay() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AVCenteredPlay);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AVCenteredPlay.__proto__ || Object.getPrototypeOf(AVCenteredPlay)).call.apply(_ref, [this].concat(args))), _this), _this.handlePlayPause = function () {
      _this.props.media.playPause();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AVCenteredPlay, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(_ref2) {
      var media = _ref2.media;

      return this.props.media.isPlaying !== media.isPlaying;
    }
  }, {
    key: 'render',
    value: function render() {
      var media = this.props.media;


      if (media.isPlaying) {
        return _react2.default.createElement('div', null);
      }

      return _react2.default.createElement(
        'button',
        {
          type: 'button',
          tabIndex: '-1',
          className: (0, _classnames2.default)('player-button'),
          onClick: this.handlePlayPause,
          style: { outline: 'none', pointerEvents: 'auto' }
        },
        _react2.default.createElement(_semanticUiReact.Icon, {
          name: 'video play',
          size: 'massive'
        })
      );
    }
  }]);

  return AVCenteredPlay;
}(_react.Component);

AVCenteredPlay.propTypes = {
  media: _propTypes2.default.shape({
    isPlaying: _propTypes2.default.bool.isRequired,
    playPause: _propTypes2.default.func.isRequired
  }).isRequired
};
exports.default = (0, _reactMediaPlayer.withMediaProps)(AVCenteredPlay);
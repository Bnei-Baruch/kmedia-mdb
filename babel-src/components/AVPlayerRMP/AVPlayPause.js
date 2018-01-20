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

var AVPlayPause = function (_Component) {
  _inherits(AVPlayPause, _Component);

  function AVPlayPause() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AVPlayPause);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AVPlayPause.__proto__ || Object.getPrototypeOf(AVPlayPause)).call.apply(_ref, [this].concat(args))), _this), _this.handlePlayPause = function () {
      _this.props.media.playPause();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AVPlayPause, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(prevProps) {
      var media = prevProps.media,
          hasNext = prevProps.hasNext,
          hasPrev = prevProps.hasPrev,
          showNextPrev = prevProps.showNextPrev;

      return this.props.media.isPlaying !== media.isPlaying || this.props.hasNext !== hasNext || this.props.hasPrev !== hasPrev || this.props.showNextPrev !== showNextPrev;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          media = _props.media,
          showNextPrev = _props.showNextPrev,
          hasNext = _props.hasNext,
          hasPrev = _props.hasPrev,
          onNext = _props.onNext,
          onPrev = _props.onPrev;


      return _react2.default.createElement(
        'div',
        { style: {
            display: 'flex',
            flexDirection: 'row',
            marginRight: '5px' }
        },
        showNextPrev ? _react2.default.createElement(
          'button',
          {
            type: 'button',
            tabIndex: '-1',
            disabled: !hasPrev,
            className: (0, _classnames2.default)('player-button'),
            onClick: onPrev,
            style: { marginRight: '5px' }
          },
          _react2.default.createElement(_semanticUiReact.Icon, {
            name: 'step backward',
            disabled: !hasPrev,
            style: { margin: 0, height: '100%' }
          })
        ) : null,
        _react2.default.createElement(
          'button',
          {
            type: 'button',
            tabIndex: '-1',
            className: (0, _classnames2.default)('player-button'),
            onClick: this.handlePlayPause
          },
          _react2.default.createElement(_semanticUiReact.Icon, {
            name: media.isPlaying ? 'pause' : 'play',
            style: { margin: 0, height: '100%' }
          })
        ),
        showNextPrev ? _react2.default.createElement(
          'button',
          {
            type: 'button',
            tabIndex: '-1',
            disabled: !hasNext,
            className: (0, _classnames2.default)('player-button'),
            onClick: onNext,
            style: { marginLeft: '5px' }
          },
          _react2.default.createElement(_semanticUiReact.Icon, {
            name: 'step forward',
            disabled: !hasNext,
            style: { margin: 0, height: '100%' }
          })
        ) : null
      );
    }
  }]);

  return AVPlayPause;
}(_react.Component);

AVPlayPause.propTypes = {
  media: _propTypes2.default.shape({
    isPlaying: _propTypes2.default.bool.isRequired,
    playPause: _propTypes2.default.func.isRequired
  }).isRequired,
  showNextPrev: _propTypes2.default.bool,
  hasNext: _propTypes2.default.bool,
  hasPrev: _propTypes2.default.bool,
  onNext: _propTypes2.default.func,
  onPrev: _propTypes2.default.func
};
AVPlayPause.defaultProps = {
  showNextPrev: null,
  hasNext: null,
  hasPrev: null,
  onNext: null,
  onPrev: null
};
exports.default = (0, _reactMediaPlayer.withMediaProps)(AVPlayPause);
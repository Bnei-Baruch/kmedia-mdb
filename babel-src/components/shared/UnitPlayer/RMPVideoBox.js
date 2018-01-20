'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = require('react-router-dom');

var _semanticUiReact = require('semantic-ui-react');

var _reactMediaPlayer = require('react-media-player');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _withIsMobile = require('../../../helpers/withIsMobile');

var _withIsMobile2 = _interopRequireDefault(_withIsMobile);

var _consts = require('../../../helpers/consts');

var _player = require('../../../helpers/player');

var _player2 = _interopRequireDefault(_player);

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _AVPlayerRMP = require('../../AVPlayerRMP/AVPlayerRMP');

var _AVPlayerRMP2 = _interopRequireDefault(_AVPlayerRMP);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RMPVideoBox = function (_Component) {
  _inherits(RMPVideoBox, _Component);

  function RMPVideoBox() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, RMPVideoBox);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RMPVideoBox.__proto__ || Object.getPrototypeOf(RMPVideoBox)).call.apply(_ref, [this].concat(args))), _this), _this.handleSwitchAV = function () {
      var history = _this.props.history;
      var playableItem = _this.state.playableItem;


      if (playableItem.mediaType === _consts.MT_VIDEO && playableItem.availableMediaTypes.includes(_consts.MT_AUDIO)) {
        _player2.default.setMediaTypeInQuery(history, _consts.MT_AUDIO);
      } else if (playableItem.mediaType === _consts.MT_AUDIO && playableItem.availableMediaTypes.includes(_consts.MT_VIDEO)) {
        _player2.default.setMediaTypeInQuery(history, _consts.MT_VIDEO);
      }
    }, _this.handleChangeLanguage = function (e, language) {
      var playableItem = _this.state.playableItem;
      var _this$props = _this.props,
          unit = _this$props.unit,
          history = _this$props.history;


      if (language !== playableItem.language) {
        _this.setPlayableItem(unit, playableItem.mediaType, language);
      }

      _player2.default.setLanguageInQuery(history, language);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RMPVideoBox, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props,
          isMobile = _props.isMobile,
          language = _props.language,
          location = _props.location,
          history = _props.history,
          unit = _props.unit;

      var mediaType = _player2.default.getMediaTypeFromQuery(location, isMobile ? _consts.MT_AUDIO : _consts.MT_VIDEO);
      var playerLanguage = _player2.default.getLanguageFromQuery(location, language);
      this.setPlayableItem(unit, mediaType, playerLanguage);
      _player2.default.setLanguageInQuery(history, playerLanguage);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var isMobile = nextProps.isMobile,
          unit = nextProps.unit,
          language = nextProps.language;

      var props = this.props;

      var prevMediaType = _player2.default.getMediaTypeFromQuery(props.location, isMobile ? _consts.MT_AUDIO : _consts.MT_VIDEO);
      var newMediaType = _player2.default.getMediaTypeFromQuery(nextProps.location, isMobile ? _consts.MT_AUDIO : _consts.MT_VIDEO);

      // no change
      if (unit === props.unit && language === props.language && prevMediaType === newMediaType) {
        return;
      }

      // Persist language in playableItem
      this.setPlayableItem(unit, newMediaType, this.state.playableItem.language);
    }
  }, {
    key: 'setPlayableItem',
    value: function setPlayableItem(unit, mediaType, language, cb) {
      var playableItem = _player2.default.playableItem(unit, mediaType, language);
      this.setState({ playableItem: playableItem }, cb);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          t = _props2.t,
          isMobile = _props2.isMobile,
          isSliceable = _props2.isSliceable;
      var playableItem = this.state.playableItem;


      if (!playableItem || !playableItem.src) {
        return _react2.default.createElement(
          'div',
          null,
          t('messages.no-playable-files')
        );
      }

      return _react2.default.createElement(
        _semanticUiReact.Grid.Row,
        null,
        _react2.default.createElement(
          _semanticUiReact.Grid.Column,
          { mobile: 16, tablet: 12, computer: 10 },
          _react2.default.createElement(
            'div',
            {
              /* FIXME(yaniv): need to be in css */
              className: (0, _classnames2.default)('avbox__player', { audio: playableItem.mediaType === _consts.MT_AUDIO }),
              style: { height: 'initial', paddingTop: '15px' }
            },
            _react2.default.createElement(
              'div',
              { className: 'avbox__media-wrapper', style: { position: 'relative' } },
              _react2.default.createElement(
                _reactMediaPlayer.Media,
                null,
                _react2.default.createElement(_AVPlayerRMP2.default, {
                  isSliceable: isSliceable,
                  item: playableItem,
                  onSwitchAV: this.handleSwitchAV,
                  languages: playableItem.availableLanguages,
                  language: playableItem.language,
                  onLanguageChange: this.handleChangeLanguage,
                  t: t,
                  isMobile: isMobile
                })
              )
            )
          )
        )
      );
    }
  }]);

  return RMPVideoBox;
}(_react.Component);

RMPVideoBox.propTypes = {
  history: _propTypes2.default.object.isRequired,
  location: shapes.HistoryLocation.isRequired,
  language: _propTypes2.default.string.isRequired,
  unit: shapes.ContentUnit,
  t: _propTypes2.default.func.isRequired,
  isMobile: _propTypes2.default.bool.isRequired,
  isSliceable: _propTypes2.default.bool
};
RMPVideoBox.defaultProps = {
  unit: undefined,
  isSliceable: false
};
exports.default = (0, _withIsMobile2.default)((0, _reactRouterDom.withRouter)(RMPVideoBox));
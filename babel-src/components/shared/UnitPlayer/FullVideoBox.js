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

var _withIsMobile = require('../../../helpers/withIsMobile');

var _withIsMobile2 = _interopRequireDefault(_withIsMobile);

var _consts = require('../../../helpers/consts');

var _url = require('../../../helpers/url');

var _player = require('../../../helpers/player');

var _player2 = _interopRequireDefault(_player);

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _AVPlaylistPlayerRMP = require('../../AVPlayerRMP/AVPlaylistPlayerRMP');

var _AVPlaylistPlayerRMP2 = _interopRequireDefault(_AVPlaylistPlayerRMP);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FullVideoBox = function (_Component) {
  _inherits(FullVideoBox, _Component);

  function FullVideoBox() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FullVideoBox);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FullVideoBox.__proto__ || Object.getPrototypeOf(FullVideoBox)).call.apply(_ref, [this].concat(args))), _this), _this.setPlaylist = function (collection, mediaType, language, cb) {
      var playlist = _player2.default.playlist(collection, mediaType, language);
      _this.setState({ playlist: playlist }, function () {
        return cb && cb(playlist);
      });
    }, _this.setActivePartInQuery = function (activePart) {
      (0, _url.updateQuery)(_this.props.history, function (query) {
        return Object.assign({}, query, { ap: activePart });
      });
    }, _this.handleChangeLanguage = function (e, language) {
      var playlist = _this.state.playlist;
      var _this$props = _this.props,
          activePart = _this$props.activePart,
          collection = _this$props.collection,
          history = _this$props.history;


      var playableItem = playlist.items[activePart];

      if (language !== playableItem.language) {
        _this.setPlaylist(collection, playableItem.mediaType, language);
      }

      _player2.default.setLanguageInQuery(history, language);
    }, _this.handleSwitchAV = function () {
      var _this$props2 = _this.props,
          activePart = _this$props2.activePart,
          history = _this$props2.history;
      var playlist = _this.state.playlist;

      var activeItem = playlist.items[activePart];
      if (activeItem.mediaType === _consts.MT_AUDIO && activeItem.availableMediaTypes.includes(_consts.MT_VIDEO)) {
        _player2.default.setMediaTypeInQuery(history, _consts.MT_VIDEO);
      } else if (activeItem.mediaType === _consts.MT_VIDEO && activeItem.availableMediaTypes.includes(_consts.MT_AUDIO)) {
        _player2.default.setMediaTypeInQuery(history, _consts.MT_AUDIO);
      }
    }, _this.handlePartClick = function (e, data) {
      return _this.setActivePartInQuery(parseInt(data.name, 10));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FullVideoBox, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props,
          isMobile = _props.isMobile,
          collection = _props.collection,
          language = _props.language,
          history = _props.history,
          location = _props.location,
          onActivePartChange = _props.onActivePartChange;

      var mediaType = _player2.default.getMediaTypeFromQuery(history.location, isMobile ? _consts.MT_AUDIO : _consts.MT_VIDEO);
      var playerLanguage = _player2.default.getLanguageFromQuery(location, language);
      this.setPlaylist(collection, mediaType, playerLanguage, function (playlist) {
        var numParts = playlist.items.length;
        var activePart = (0, _url.getQuery)(location).ap;

        if (activePart == null || activePart >= numParts) {
          activePart = 0;
        }

        onActivePartChange(parseInt(activePart, 10));
      });

      _player2.default.setLanguageInQuery(history, playerLanguage);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var isMobile = nextProps.isMobile,
          collection = nextProps.collection,
          language = nextProps.language,
          location = nextProps.location,
          onActivePartChange = nextProps.onActivePartChange;
      var _props2 = this.props,
          oldCollection = _props2.collection,
          oldLanguage = _props2.language,
          oldLocation = _props2.location;


      var prevMediaType = _player2.default.getMediaTypeFromQuery(oldLocation, isMobile ? _consts.MT_AUDIO : _consts.MT_VIDEO);
      var newMediaType = _player2.default.getMediaTypeFromQuery(location, isMobile ? _consts.MT_AUDIO : _consts.MT_VIDEO);

      if (oldCollection !== collection || oldLanguage !== language || prevMediaType !== newMediaType) {
        // Persist language in playableItem
        this.setPlaylist(collection, newMediaType, this.state.playlist.language);
      }

      var oldLocationActivePart = (0, _url.getQuery)(oldLocation).ap;
      var locationActivePart = (0, _url.getQuery)(location).ap;
      if (oldLocationActivePart !== locationActivePart) {
        var activePart = parseInt(locationActivePart, 10);
        onActivePartChange(isNaN(activePart) ? 0 : activePart);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          t = _props3.t,
          activePart = _props3.activePart,
          collection = _props3.collection,
          PlayListComponent = _props3.PlayListComponent;
      var playlist = this.state.playlist;


      return _react2.default.createElement(
        _semanticUiReact.Grid.Row,
        null,
        _react2.default.createElement(
          _semanticUiReact.Grid.Column,
          { computer: 10, mobile: 16 },
          _react2.default.createElement(_AVPlaylistPlayerRMP2.default, {
            playlist: playlist,
            activePart: activePart,
            onActivePartChange: this.setActivePartInQuery,
            onLanguageChange: this.handleChangeLanguage,
            onSwitchAV: this.handleSwitchAV,
            t: t
          })
        ),
        _react2.default.createElement(
          _semanticUiReact.Grid.Column,
          { className: 'avbox__playlist', computer: 6, mobile: 16 },
          _react2.default.createElement(PlayListComponent, {
            collection: collection,
            activePart: activePart,
            t: t,
            onItemClick: this.handlePartClick
          })
        )
      );
    }
  }]);

  return FullVideoBox;
}(_react.Component);

FullVideoBox.propTypes = {
  history: _propTypes2.default.object.isRequired,
  location: shapes.HistoryLocation.isRequired,
  PlayListComponent: _propTypes2.default.any,
  language: _propTypes2.default.string.isRequired,
  collection: shapes.GenericCollection.isRequired,
  activePart: _propTypes2.default.number,
  onActivePartChange: _propTypes2.default.func.isRequired,
  t: _propTypes2.default.func.isRequired,
  isMobile: _propTypes2.default.bool.isRequired
};
FullVideoBox.defaultProps = {
  activePart: 0,
  PlayListComponent: null
};
exports.default = (0, _withIsMobile2.default)((0, _reactRouterDom.withRouter)(FullVideoBox));
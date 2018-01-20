'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('moment-duration-format');

var _reactI18next = require('react-i18next');

var _semanticUiReact = require('semantic-ui-react');

var _utils = require('../../../helpers/utils');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _Splash = require('../../shared/Splash');

var _FullVideoBox = require('../../shared/UnitPlayer/FullVideoBox');

var _FullVideoBox2 = _interopRequireDefault(_FullVideoBox);

var _Materials = require('../../shared/UnitMaterials/Materials');

var _Materials2 = _interopRequireDefault(_Materials);

var _MediaDownloads = require('../../shared/MediaDownloads');

var _MediaDownloads2 = _interopRequireDefault(_MediaDownloads);

var _MultiLanguageLink = require('../../Language/MultiLanguageLink');

var _MultiLanguageLink2 = _interopRequireDefault(_MultiLanguageLink);

var _Info = require('../Item/Info');

var _Info2 = _interopRequireDefault(_Info);

var _Playlist = require('./Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import PageHeader from './PageHeader';
// import EventMap from './EventMap';


var FullEvent = function (_Component) {
  _inherits(FullEvent, _Component);

  function FullEvent() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FullEvent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FullEvent.__proto__ || Object.getPrototypeOf(FullEvent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      activePart: 0
    }, _this.handleActivePartChange = function (activePart) {
      return _this.setState({ activePart: activePart });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FullEvent, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          language = _props.language,
          fullEvent = _props.fullEvent,
          wip = _props.wip,
          err = _props.err,
          t = _props.t;
      var activePart = this.state.activePart;


      if (err) {
        if (err.response && err.response.status === 404) {
          return _react2.default.createElement(_Splash.FrownSplash, {
            text: t('messages.event-not-found'),
            subtext: _react2.default.createElement(
              _reactI18next.Trans,
              { i18nKey: 'messages.event-not-found-subtext' },
              'Try the ',
              _react2.default.createElement(
                _MultiLanguageLink2.default,
                { to: '/events' },
                'events list'
              ),
              '...'
            )
          });
        }

        return _react2.default.createElement(_Splash.ErrorSplash, { text: t('messages.server-error'), subtext: (0, _utils.formatError)(err) });
      }

      if (wip) {
        return _react2.default.createElement(_Splash.LoadingSplash, { text: t('messages.loading'), subtext: t('messages.loading-subtext') });
      }

      if (!fullEvent || !Array.isArray(fullEvent.content_units)) {
        return null;
      }

      var activeUnit = fullEvent.content_units[activePart];
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'avbox' },
          _react2.default.createElement(
            _semanticUiReact.Container,
            null,
            _react2.default.createElement(
              _semanticUiReact.Grid,
              { padded: true },
              _react2.default.createElement(_FullVideoBox2.default, {
                collection: fullEvent,
                activePart: activePart,
                language: language,
                t: t,
                onActivePartChange: this.handleActivePartChange,
                PlayListComponent: _Playlist2.default
              })
            )
          )
        ),
        _react2.default.createElement(
          _semanticUiReact.Container,
          null,
          _react2.default.createElement(
            _semanticUiReact.Grid,
            { padded: true, reversed: 'tablet' },
            _react2.default.createElement(
              _semanticUiReact.Grid.Row,
              { reversed: 'computer' },
              _react2.default.createElement(
                _semanticUiReact.Grid.Column,
                { computer: 6, tablet: 4, mobile: 16 },
                _react2.default.createElement(_MediaDownloads2.default, { unit: activeUnit, language: language, t: t })
              ),
              _react2.default.createElement(
                _semanticUiReact.Grid.Column,
                { computer: 10, tablet: 12, mobile: 16 },
                _react2.default.createElement(_Info2.default, { unit: activeUnit, t: t }),
                _react2.default.createElement(_Materials2.default, { unit: activeUnit, t: t })
              )
            )
          )
        )
      );
    }
  }]);

  return FullEvent;
}(_react.Component);

FullEvent.propTypes = {
  language: _propTypes2.default.string.isRequired,
  fullEvent: shapes.EventCollection,
  wip: shapes.WIP,
  err: shapes.Error,
  t: _propTypes2.default.func.isRequired
};
FullEvent.defaultProps = {
  fullEvent: null,
  wip: false,
  err: null
};
exports.default = (0, _reactI18next.translate)()(FullEvent);
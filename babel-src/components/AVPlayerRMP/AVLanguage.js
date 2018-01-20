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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _semanticUiReact = require('semantic-ui-react');

var _consts = require('../../helpers/consts');

var _TimedPopup = require('../shared/TimedPopup');

var _TimedPopup2 = _interopRequireDefault(_TimedPopup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AVLanguage = function (_Component) {
  _inherits(AVLanguage, _Component);

  function AVLanguage() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AVLanguage);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AVLanguage.__proto__ || Object.getPrototypeOf(AVLanguage)).call.apply(_ref, [this].concat(args))), _this), _this.handleChange = function (e, data) {
      return _this.props.onSelect(e, data.value);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AVLanguage, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          t = _props.t,
          languages = _props.languages,
          language = _props.language,
          requestedLanguage = _props.requestedLanguage,
          upward = _props.upward;


      var options = _consts.LANGUAGE_OPTIONS.filter(function (x) {
        return languages.includes(x.value);
      }).map(function (x) {
        return { value: x.value, text: x.value };
      });

      var popup = language === requestedLanguage ? null : _react2.default.createElement(_TimedPopup2.default, {
        openOnInit: true,
        message: t('messages.fallback-language'),
        downward: !upward,
        timeout: 7000
      });

      return _react2.default.createElement(
        'div',
        {
          className: 'player-control-language'
        },
        popup,
        _react2.default.createElement(_semanticUiReact.Dropdown, {
          floating: true,
          inline: true,
          scrolling: true,
          upward: upward,
          icon: null,
          selectOnBlur: false,
          options: options,
          value: language,
          onChange: this.handleChange,
          className: (0, _classnames2.default)('player-button'),
          style: { display: 'flex', textDecoration: 'underline' }
        })
      );
    }
  }]);

  return AVLanguage;
}(_react.Component);

AVLanguage.propTypes = {
  t: _propTypes2.default.func.isRequired,
  onSelect: _propTypes2.default.func,
  language: _propTypes2.default.string,
  requestedLanguage: _propTypes2.default.string,
  languages: _propTypes2.default.arrayOf(_propTypes2.default.string),
  upward: _propTypes2.default.bool
};
AVLanguage.defaultProps = {
  onSelect: _noop2.default,
  language: _consts.LANG_HEBREW,
  requestedLanguage: _consts.LANG_HEBREW,
  languages: [],
  upward: true
};
exports.default = AVLanguage;
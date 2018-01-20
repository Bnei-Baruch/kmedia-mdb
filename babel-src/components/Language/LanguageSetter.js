'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = require('react-router-dom');

var _reactRedux = require('react-redux');

var _settings = require('../../redux/modules/settings');

var _consts = require('../../helpers/consts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// NOTE: yaniv -> edo: should we block rendering until language changed?

var LanguageSetter = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(function (state) {
  return {
    currentLanguage: _settings.selectors.getLanguage(state.settings)
  };
}, { setLanguage: _settings.actions.setLanguage })((_temp2 = _class = function (_React$Component) {
  _inherits(_class, _React$Component);

  function _class() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, _class);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args))), _this), _this.catchLanguageChange = function (props) {
      var newLanguage = props.language,
          currentLanguage = props.currentLanguage;


      if (currentLanguage === newLanguage) {
        return;
      }

      var actualLanguage = _consts.DEFAULT_LANGUAGE;
      if (_consts.LANGUAGES[newLanguage]) {
        actualLanguage = newLanguage;
      }

      props.setLanguage(actualLanguage);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(_class, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.catchLanguageChange(nextProps);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.catchLanguageChange(this.props);
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return _class;
}(_react2.default.Component), _class.propTypes = {
  currentLanguage: _propTypes2.default.string.isRequired,
  language: _propTypes2.default.string,
  setLanguage: _propTypes2.default.func.isRequired,
  location: _propTypes2.default.object.isRequired
}, _class.defaultProps = {
  language: _consts.DEFAULT_LANGUAGE
}, _temp2)));

exports.default = LanguageSetter;
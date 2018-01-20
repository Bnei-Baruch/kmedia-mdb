'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _reactRouterDom = require('react-router-dom');

var _url = require('../../helpers/url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * multiLanguageLinkCreator - an higher order component to create a link that allows navigating
 * while keeping the current active language in the url, or changing to a new language on navigation.
 *
 * The wrapped component will keep most of the react-router-dom Link interface, with the following changes:
 * - it adds a language prop to the wrapped component if you need to force a language to the specific route.
 * - the "to" prop is not required like react-router-dom Link does, instead, if it is not supplied it will use the current location.
 *
 * There is a priority for how the active language after navigation is chosen (in descending order):
 * 1. the "language" prop
 * 2. the "to" prop contains a pathname that starts with a language's shorthand, for example: /ru/<Rest of url>,
 * 3. the current pathname's language shorthand if it exists in the pathname
 *
 * If you want to change the language, it is preferred to use the "language" prop instead of prefixing the pathname in the to prop.
 * i.e - use <Component to="/some-path" language="ru" /> instead of <Component to="/ru/some-path" />
 */

var multiLanguageLinkCreator = function multiLanguageLinkCreator() {
  return function (WrappedComponent) {
    var MultiLanguageLinkHOC = function (_Component) {
      _inherits(MultiLanguageLinkHOC, _Component);

      function MultiLanguageLinkHOC() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, MultiLanguageLinkHOC);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MultiLanguageLinkHOC.__proto__ || Object.getPrototypeOf(MultiLanguageLinkHOC)).call.apply(_ref, [this].concat(args))), _this), _this.prefixPath = function (path) {
          var _this$props = _this.props,
              location = _this$props.location,
              language = _this$props.language;

          return (0, _url.prefixWithLanguage)(path, location, language);
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(MultiLanguageLinkHOC, [{
        key: 'render',
        value: function render() {
          var _props = this.props,
              to = _props.to,
              language = _props.language,
              location = _props.location,
              match = _props.match,
              history = _props.history,
              staticContext = _props.staticContext,
              rest = _objectWithoutProperties(_props, ['to', 'language', 'location', 'match', 'history', 'staticContext']);

          var navigateTo = to;
          var toWithLanguage = void 0;

          if (typeof navigateTo === 'string') {
            toWithLanguage = this.prefixPath(navigateTo);
          } else {
            if (!navigateTo) {
              navigateTo = location;
            }

            toWithLanguage = Object.assign({}, navigateTo, {
              pathname: this.prefixPath(navigateTo.pathname)
            });
          }

          return _react2.default.createElement(WrappedComponent, Object.assign({ to: toWithLanguage }, rest));
        }
      }]);

      return MultiLanguageLinkHOC;
    }(_react.Component);

    MultiLanguageLinkHOC.propTypes = Object.assign({}, _reactRouterDom.Link.propTypes, {
      to: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
      location: _propTypes2.default.object.isRequired,
      language: _propTypes2.default.string // language shorthand, for example: "ru"
    });
    MultiLanguageLinkHOC.defaultProps = {
      language: '',
      to: undefined
    };


    return (0, _reactRouterDom.withRouter)((0, _hoistNonReactStatics2.default)(MultiLanguageLinkHOC, WrappedComponent));
  };
};

exports.default = multiLanguageLinkCreator;
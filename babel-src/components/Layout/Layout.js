'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactI18next = require('react-i18next');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactRouterDom = require('react-router-dom');

var _semanticUiReact = require('semantic-ui-react');

var _consts = require('../../helpers/consts');

var _shapes = require('../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _MultiLanguageLink = require('../Language/MultiLanguageLink');

var _MultiLanguageLink2 = _interopRequireDefault(_MultiLanguageLink);

var _OmniBox = require('../Search/OmniBox');

var _OmniBox2 = _interopRequireDefault(_OmniBox);

var _GAPageView = require('../GAPageView/GAPageView');

var _GAPageView2 = _interopRequireDefault(_GAPageView);

var _Routes = require('./Routes');

var _Routes2 = _interopRequireDefault(_Routes);

var _MenuItems = require('./MenuItems');

var _MenuItems2 = _interopRequireDefault(_MenuItems);

var _Footer = require('./Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _logo = require('../../images/logo.svg');

var _logo2 = _interopRequireDefault(_logo);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var flags = ['us', 'ru', 'il'];

var Layout = function (_Component) {
  _inherits(Layout, _Component);

  function Layout() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Layout);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Layout.__proto__ || Object.getPrototypeOf(Layout)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      sidebarActive: false
    }, _this.clickOutside = function (e) {
      if (_this.state.sidebarActive && e.target !== _this.sidebarElement && !_this.sidebarElement.contains(e.target)) {
        _this.closeSidebar();
      }
    }, _this.toggleSidebar = function () {
      return _this.setState({ sidebarActive: !_this.state.sidebarActive });
    }, _this.closeSidebar = function () {
      return _this.setState({ sidebarActive: false });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Layout, [{
    key: 'componentDidMount',


    // Required for handling outhide sidebar on click outside sidebar,
    // i.e, main, header of footer.
    value: function componentDidMount() {
      document.addEventListener('click', this.clickOutside, true);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('click', this.clickOutside, true);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          t = _props.t,
          location = _props.location;
      var sidebarActive = this.state.sidebarActive;


      return _react2.default.createElement(
        'div',
        { className: 'layout' },
        _react2.default.createElement(_GAPageView2.default, { location: location }),
        _react2.default.createElement(
          'div',
          { className: 'layout__header', style: { width: '100vw' } },
          _react2.default.createElement(
            _semanticUiReact.Menu,
            { inverted: true, borderless: true, size: 'huge', color: 'blue', style: { width: '100vw' } },
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { icon: true, as: 'a', className: 'layout__sidebar-toggle', onClick: this.toggleSidebar },
              _react2.default.createElement(_semanticUiReact.Icon, { name: 'sidebar' })
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { className: 'logo', header: true, as: _MultiLanguageLink2.default, to: '/' },
              _react2.default.createElement('img', { src: _logo2.default, alt: 'logo' }),
              _react2.default.createElement(
                _semanticUiReact.Header,
                { inverted: true, as: 'h2' },
                t('nav.top.header')
              )
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { style: { flex: 1 } },
              _react2.default.createElement(_OmniBox2.default, { t: t, location: location })
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Menu,
              { position: 'right' },
              _react2.default.createElement(
                _semanticUiReact.Menu.Item,
                null,
                flags.map(function (flag) {
                  return _react2.default.createElement(
                    _MultiLanguageLink2.default,
                    { language: _consts.FLAG_TO_LANGUAGE[flag], key: flag },
                    _react2.default.createElement(_semanticUiReact.Flag, { name: flag })
                  );
                })
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          {
            className: (0, _classnames2.default)('layout__sidebar', { 'is-active': sidebarActive }),
            ref: function ref(el) {
              return _this2.sidebarElement = el;
            }
          },
          _react2.default.createElement(
            _semanticUiReact.Menu,
            { inverted: true, borderless: true, size: 'huge', color: 'blue' },
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { icon: true, as: 'a', className: 'layout__sidebar-toggle', onClick: this.closeSidebar },
              _react2.default.createElement(_semanticUiReact.Icon, { name: 'sidebar' })
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { className: 'logo', header: true, as: _MultiLanguageLink2.default, to: '/', onClick: this.closeSidebar },
              _react2.default.createElement('img', { src: _logo2.default, alt: 'logo' }),
              _react2.default.createElement(
                _semanticUiReact.Header,
                { inverted: true, as: 'h2' },
                t('nav.top.header')
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'layout__sidebar-menu' },
            _react2.default.createElement(_MenuItems2.default, { simple: true, t: t, onItemClick: this.closeSidebar })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'layout__main' },
          _react2.default.createElement(
            'div',
            { className: 'layout__content' },
            _react2.default.createElement(_reactRouterDom.Route, { component: _Routes2.default })
          ),
          _react2.default.createElement(_Footer2.default, null)
        )
      );
    }
  }]);

  return Layout;
}(_react.Component);

Layout.propTypes = {
  t: _propTypes2.default.func.isRequired,
  location: shapes.HistoryLocation.isRequired
};
exports.default = (0, _reactI18next.translate)()(Layout);
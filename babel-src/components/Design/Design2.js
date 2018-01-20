'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _semanticUiReact = require('semantic-ui-react');

var _MultiLanguageLink = require('../Language/MultiLanguageLink');

var _MultiLanguageLink2 = _interopRequireDefault(_MultiLanguageLink);

var _MenuItems = require('../Layout/MenuItems');

var _MenuItems2 = _interopRequireDefault(_MenuItems);

var _Routes = require('../Layout/Routes');

var _Routes2 = _interopRequireDefault(_Routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Design2 = function (_Component) {
  _inherits(Design2, _Component);

  function Design2() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Design2);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Design2.__proto__ || Object.getPrototypeOf(Design2)).call.apply(_ref, [this].concat(args))), _this), _this.toggleSidebar = function (e, data) {
      document.querySelector('.layout__sidebar').classList.toggle('is-active');
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Design2, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'layout' },
        _react2.default.createElement(
          'div',
          { className: 'layout__header' },
          _react2.default.createElement(
            _semanticUiReact.Menu,
            { inverted: true, size: 'huge', borderless: true, color: 'blue' },
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { className: 'layout__sidebar-toggle', as: 'a', icon: true, onClick: this.toggleSidebar },
              _react2.default.createElement(_semanticUiReact.Icon, { name: 'sidebar' })
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { as: _MultiLanguageLink2.default, to: '/', header: true },
              _react2.default.createElement(
                _semanticUiReact.Header,
                { inverted: true, as: 'h2' },
                'Kabbalah Media',
                _react2.default.createElement(
                  'small',
                  null,
                  '\xA0- Daily Lessons'
                )
              )
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { as: _MultiLanguageLink2.default, to: '/home' },
              ' Features '
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { as: _MultiLanguageLink2.default, to: '/home' },
              ' Testimonials '
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { as: _MultiLanguageLink2.default, to: '/home' },
              ' Sign-in '
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Menu,
              { position: 'right' },
              _react2.default.createElement(
                _semanticUiReact.Menu.Item,
                null,
                _react2.default.createElement(_semanticUiReact.Flag, { name: 'us', onClick: this.handleChangeLanguage }),
                _react2.default.createElement(_semanticUiReact.Flag, { name: 'ru', onClick: this.handleChangeLanguage }),
                _react2.default.createElement(_semanticUiReact.Flag, { name: 'il', onClick: this.handleChangeLanguage })
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'layout__sidebar' },
          _react2.default.createElement(
            _semanticUiReact.Menu,
            { inverted: true, size: 'huge', borderless: true, color: 'blue' },
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { className: 'layout__sidebar-toggle', as: 'a', icon: true, onClick: this.toggleSidebar },
              _react2.default.createElement(_semanticUiReact.Icon, { name: 'sidebar' })
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { as: _MultiLanguageLink2.default, to: '/', header: true },
              _react2.default.createElement(
                _semanticUiReact.Header,
                { inverted: true, as: 'h2' },
                'Kabbalah Media'
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'layout__sidebar-menu' },
            _react2.default.createElement(_MenuItems2.default, { simple: true })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'layout__content' },
          _react2.default.createElement(
            _semanticUiReact.Grid,
            { padded: true },
            _react2.default.createElement(
              _semanticUiReact.Grid.Row,
              null,
              _react2.default.createElement(_Routes2.default, null)
            )
          ),
          _react2.default.createElement('div', { className: 'layout__footer' })
        )
      );
    }
  }]);

  return Design2;
}(_react.Component);

exports.default = Design2;
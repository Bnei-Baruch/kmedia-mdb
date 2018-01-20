'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _reactRouterDom = require('react-router-dom');

var _system = require('../../redux/modules/system');

var _Routes = require('./Routes');

var _Routes2 = _interopRequireDefault(_Routes);

require('../../stylesheets/Kmedia.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loader = function Loader() {
  return _react2.default.createElement(
    'div',
    { style: {
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    },
    _react2.default.createElement(
      'h1',
      { style: { color: 'white' } },
      'Loading...'
    )
  );
};

var App = function (_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      var isAppReady = this.props.isAppReady;


      if (isAppReady) {
        return _react2.default.createElement(_Routes2.default, null);
      }

      return _react2.default.createElement(Loader, null);
    }
  }]);

  return App;
}(_react.Component);

App.propTypes = {
  isAppReady: _propTypes2.default.bool
};
App.defaultProps = {
  isAppReady: false
};
exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(function (state) {
  return { isAppReady: _system.selectors.isReady(state.system) };
})(App));
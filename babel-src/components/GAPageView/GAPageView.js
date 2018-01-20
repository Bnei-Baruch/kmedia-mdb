'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactGa = require('react-ga');

var _reactGa2 = _interopRequireDefault(_reactGa);

var _shapes = require('../shapes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GAPageView = function (_Component) {
  _inherits(GAPageView, _Component);

  function GAPageView(props) {
    _classCallCheck(this, GAPageView);

    // Initial page load - only fired once
    var _this = _possibleConstructorReturn(this, (GAPageView.__proto__ || Object.getPrototypeOf(GAPageView)).call(this, props));

    _this.sendPageChange = function (pathname) {
      var search = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var page = pathname + search;
      _reactGa2.default.set({ page: page });
      _reactGa2.default.pageview(page);
    };

    _this.sendPageChange(props.location.pathname, props.location.search);
    return _this;
  }

  _createClass(GAPageView, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // When props change, check if the URL has changed or not
      if (this.props.location.pathname !== nextProps.location.pathname) {
        this.sendPageChange(nextProps.location.pathname, nextProps.location.search);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', null);
    }
  }]);

  return GAPageView;
}(_react.Component);

GAPageView.propTypes = {
  location: _shapes.HistoryLocation.isRequired
};

exports.default = GAPageView;
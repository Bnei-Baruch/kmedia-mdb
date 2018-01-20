'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = withIsMobile;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MOBILE_WIDTH = 768;

function withIsMobile(SomeComponent) {
  return function (_Component) {
    _inherits(_class2, _Component);

    function _class2() {
      _classCallCheck(this, _class2);

      var _this = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this));

      _this.width = function () {
        return document.documentElement.clientWidth;
      };

      _this.handleWindowSizeChange = function () {
        if (_this.componentIsMounted && _this.state.isMobile !== _this.width() <= MOBILE_WIDTH) {
          _this.setState({ isMobile: _this.width() <= MOBILE_WIDTH });
        }
      };

      _this.state = {
        isMobile: _this.width() <= MOBILE_WIDTH
      };
      return _this;
    }

    _createClass(_class2, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.componentIsMounted = true;
        window.addEventListener('resize', this.handleWindowSizeChange);
        this.handleWindowSizeChange();
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
        this.componentIsMounted = false;
      }
    }, {
      key: 'render',
      value: function render() {
        var isMobile = this.state.isMobile;


        return _react2.default.createElement(SomeComponent, Object.assign({}, this.props, {
          isMobile: isMobile
        }));
      }
    }]);

    return _class2;
  }(_react.Component);
}
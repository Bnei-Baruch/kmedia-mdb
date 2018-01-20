'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabsMenu = function (_Component) {
  _inherits(TabsMenu, _Component);

  function TabsMenu(props) {
    _classCallCheck(this, TabsMenu);

    var _this = _possibleConstructorReturn(this, (TabsMenu.__proto__ || Object.getPrototypeOf(TabsMenu)).call(this, props));

    _this.handleActiveChange = function (e, _ref) {
      var name = _ref.name;
      return _this.setState({ active: name });
    };

    var active = props.active;

    if (!active) {
      var items = props.items;

      if (items.length > 0) {
        active = items[0].name;
      }
    }

    _this.state = { active: active };
    return _this;
  }

  _createClass(TabsMenu, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var active = nextProps.active;

      if (active !== this.props.active) {
        this.setState({ active: active });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var active = this.state.active;
      var items = this.props.items;

      var activeItem = items.find(function (x) {
        return x.name === active;
      });

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _semanticUiReact.Menu,
          { secondary: true, pointing: true, color: 'blue' },
          items.map(function (item) {
            var name = item.name,
                label = item.label;

            return _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              {
                key: name,
                name: name,
                active: active === name,
                onClick: _this2.handleActiveChange
              },
              label
            );
          })
        ),
        activeItem.component
      );
    }
  }]);

  return TabsMenu;
}(_react.Component);

TabsMenu.propTypes = {
  items: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.string.isRequired,
    label: _propTypes2.default.string.isRequired,
    component: _propTypes2.default.node.isRequired
  })),
  active: _propTypes2.default.string
};
TabsMenu.defaultProps = {
  items: [],
  active: ''
};
exports.default = TabsMenu;
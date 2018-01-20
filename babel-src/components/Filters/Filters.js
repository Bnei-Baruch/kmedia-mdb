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

var _shapes = require('../shapes');

var _filters = require('../../redux/modules/filters');

var _ActiveFilter = require('./ActiveFilter/ActiveFilter');

var _ActiveFilter2 = _interopRequireDefault(_ActiveFilter);

var _FilterMenu = require('./FilterMenu/FilterMenu');

var _FilterMenu2 = _interopRequireDefault(_FilterMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Filters = function (_Component) {
  _inherits(Filters, _Component);

  function Filters() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Filters);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Filters.__proto__ || Object.getPrototypeOf(Filters)).call.apply(_ref, [this].concat(args))), _this), _this.handleFilterClick = function (_ref2) {
      var name = _ref2.name;
      var namespace = _this.props.namespace;

      _this.props.editNewFilter(namespace, name);
    }, _this.handleCancelActiveFilter = function () {
      var _this$props = _this.props,
          namespace = _this$props.namespace,
          activeFilterName = _this$props.activeFilterName;

      _this.props.closeActiveFilter(namespace, activeFilterName);
    }, _this.handleApplyActiveFilter = function () {
      _this.props.onFilterApplication();
      _this.handleCancelActiveFilter();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Filters, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          filters = _props.filters,
          activeFilterName = _props.activeFilterName,
          namespace = _props.namespace;


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_FilterMenu2.default, { items: filters, namespace: namespace, active: activeFilterName, onChoose: this.handleFilterClick }),
        _react2.default.createElement(_ActiveFilter2.default, {
          namespace: namespace,
          activeFilterName: activeFilterName,
          filters: filters,
          onCancel: this.handleCancelActiveFilter,
          onApply: this.handleApplyActiveFilter
        })
      );
    }
  }]);

  return Filters;
}(_react.Component);

Filters.propTypes = {
  namespace: _propTypes2.default.string.isRequired,
  onFilterApplication: _propTypes2.default.func.isRequired,
  editNewFilter: _propTypes2.default.func.isRequired,
  closeActiveFilter: _propTypes2.default.func.isRequired,
  filters: _propTypes2.default.arrayOf(_shapes.filterPropShape).isRequired,
  activeFilterName: _propTypes2.default.string
};
Filters.defaultProps = {
  activeFilterName: ''
};
exports.default = (0, _reactRedux.connect)(function (state, ownProps) {
  return {
    activeFilterName: _filters.selectors.getActiveFilter(state.filters, ownProps.namespace)
  };
}, _filters.actions)(Filters);
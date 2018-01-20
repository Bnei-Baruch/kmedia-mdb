'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _semanticUiReact = require('semantic-ui-react');

var _shapes = require('../../shapes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActiveFilter = function (_PureComponent) {
  _inherits(ActiveFilter, _PureComponent);

  function ActiveFilter() {
    _classCallCheck(this, ActiveFilter);

    return _possibleConstructorReturn(this, (ActiveFilter.__proto__ || Object.getPrototypeOf(ActiveFilter)).apply(this, arguments));
  }

  _createClass(ActiveFilter, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          activeFilterName = _props.activeFilterName,
          filters = _props.filters,
          onCancel = _props.onCancel,
          onApply = _props.onApply,
          rest = _objectWithoutProperties(_props, ['activeFilterName', 'filters', 'onCancel', 'onApply']);

      var activeFilter = (0, _find2.default)(filters, function (filter) {
        return filter.name === activeFilterName;
      });

      if (!activeFilter) {
        return null;
      }

      var Component = activeFilter.component,
          name = activeFilter.name;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _semanticUiReact.Container,
          { className: 'padded horizontally' },
          _react2.default.createElement(Component, Object.assign({ onCancel: onCancel, onApply: onApply, name: name }, rest))
        )
      );
    }
  }]);

  return ActiveFilter;
}(_react.PureComponent);

ActiveFilter.propTypes = {
  filters: _propTypes2.default.arrayOf(_shapes.filterPropShape).isRequired,
  activeFilterName: _propTypes2.default.string,
  onCancel: _propTypes2.default.func.isRequired,
  onApply: _propTypes2.default.func.isRequired
};
ActiveFilter.defaultProps = {
  activeFilterName: null
};
exports.default = ActiveFilter;
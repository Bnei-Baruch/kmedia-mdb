'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _reactRedux = require('react-redux');

var _semanticUiReact = require('semantic-ui-react');

var _filters = require('../../../filters');

var _filters2 = require('../../../redux/modules/filters');

var _FilterTag = require('../FilterTag/FilterTag');

var _FilterTag2 = _interopRequireDefault(_FilterTag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FilterTags = function (_Component) {
  _inherits(FilterTags, _Component);

  function FilterTags() {
    _classCallCheck(this, FilterTags);

    return _possibleConstructorReturn(this, (FilterTags.__proto__ || Object.getPrototypeOf(FilterTags)).apply(this, arguments));
  }

  _createClass(FilterTags, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          tags = _props.tags,
          namespace = _props.namespace;
      var _context = this.context,
          store = _context.store,
          t = _context.t;


      return _react2.default.createElement(
        'div',
        { className: 'filter-tags' },
        _react2.default.createElement(
          _semanticUiReact.Container,
          { className: 'padded' },
          tags.map(function (tag) {
            var icon = _filters.filtersTransformer.getTagIcon(tag.name);
            var label = _filters.filtersTransformer.valueToTagLabel(tag.name, tag.value, _this2.props, store, t);
            return _react2.default.createElement(_FilterTag2.default, {
              key: tag.name + '_' + tag.index,
              icon: icon,
              isActive: tag.isActive,
              label: label,
              onClick: function onClick() {
                return _this2.props.editExistingFilter(namespace, tag.name, tag.index);
              },
              onClose: function onClose() {
                _this2.props.removeFilterValue(namespace, tag.name, tag.value);
                _this2.props.onClose();
              }
            });
          })
        )
      );
    }
  }]);

  return FilterTags;
}(_react.Component);

FilterTags.propTypes = {
  namespace: _propTypes2.default.string.isRequired,
  tags: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.string.isRequired,
    value: _propTypes2.default.any
  })),
  removeFilterValue: _propTypes2.default.func.isRequired,
  editExistingFilter: _propTypes2.default.func.isRequired,
  onClose: _propTypes2.default.func.isRequired
};
FilterTags.defaultProps = {
  tags: []
};
FilterTags.contextTypes = {
  store: _propTypes2.default.object.isRequired,
  t: _propTypes2.default.func.isRequired
};
exports.default = (0, _reactRedux.connect)(function (state, ownProps) {
  // TODO (yaniv): use reselect to cache selector
  var filters = _filters2.selectors.getFilters(state.filters, ownProps.namespace);
  var activeFilter = _filters2.selectors.getActiveFilter(state.filters, ownProps.namespace);

  var tags = (0, _reduce2.default)(filters, function (acc, filter) {
    var values = filter.values || [];
    return acc.concat(values.map(function (value, index) {
      var activeValueIndex = _filters2.selectors.getActiveValueIndex(state.filters, ownProps.namespace, filter.name);
      return {
        name: filter.name,
        index: index,
        value: value,
        isActive: activeFilter === filter.name && activeValueIndex === index
      };
    }));
  }, []);

  return { tags: tags };
}, _filters2.actions)(FilterTags);
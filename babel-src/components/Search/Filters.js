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

var _reactI18next = require('react-i18next');

var _Filters = require('../Filters/Filters');

var _Filters2 = _interopRequireDefault(_Filters);

var _filterComponents = require('../Filters/filterComponents');

var _filterComponents2 = _interopRequireDefault(_filterComponents);

var _FiltersHydrator = require('../Filters/FiltersHydrator/FiltersHydrator');

var _FiltersHydrator2 = _interopRequireDefault(_FiltersHydrator);

var _FilterTags = require('../Filters/FilterTags/FilterTags');

var _FilterTags2 = _interopRequireDefault(_FilterTags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var filters = [{
  name: 'date-filter',
  component: _filterComponents2.default.DateFilter
}, {
  name: 'topics-filter',
  component: _filterComponents2.default.MultiTopicsFilter
}];

var SearchResultsFilters = function (_Component) {
  _inherits(SearchResultsFilters, _Component);

  function SearchResultsFilters() {
    _classCallCheck(this, SearchResultsFilters);

    return _possibleConstructorReturn(this, (SearchResultsFilters.__proto__ || Object.getPrototypeOf(SearchResultsFilters)).apply(this, arguments));
  }

  _createClass(SearchResultsFilters, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          t = _props.t,
          sortBy = _props.sortBy,
          onSortByChange = _props.onSortByChange,
          onHydrated = _props.onHydrated,
          onChange = _props.onChange;


      var options = ['relevance', 'newertoolder', 'oldertonewer'].map(function (o) {
        return {
          text: t('search.sorts.' + o),
          value: o
        };
      });

      return _react2.default.createElement(
        'div',
        { style: { display: 'flex' } },
        _react2.default.createElement(
          'div',
          { style: { flex: '1', display: 'flex', flexDirection: 'column' } },
          _react2.default.createElement(_FiltersHydrator2.default, { namespace: 'search', onHydrated: onHydrated }),
          _react2.default.createElement(_Filters2.default, { namespace: 'search', filters: filters, onFilterApplication: onChange }),
          _react2.default.createElement(_FilterTags2.default, { namespace: 'search', onClose: onChange })
        ),
        _react2.default.createElement(
          'div',
          { style: { borderBottom: '2px solid rgba(34,36,38,.15)',
              display: 'inline-table',
              paddingBottom: '3px' } },
          _react2.default.createElement(
            'span',
            { style: { padding: '10px' } },
            t('search.sortby'),
            ':'
          ),
          _react2.default.createElement(_semanticUiReact.Dropdown, {
            compact: true,
            selection: true,
            options: options,
            value: sortBy,
            onChange: onSortByChange
          })
        )
      );
    }
  }]);

  return SearchResultsFilters;
}(_react.Component);

SearchResultsFilters.propTypes = {
  t: _propTypes2.default.func.isRequired,
  sortBy: _propTypes2.default.string.isRequired,
  onSortByChange: _propTypes2.default.func.isRequired,
  onHydrated: _propTypes2.default.func.isRequired,
  onChange: _propTypes2.default.func.isRequired
};
exports.default = (0, _reactI18next.translate)()(SearchResultsFilters);
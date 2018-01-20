'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reactRouterRedux = require('react-router-redux');

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _semanticUiReact = require('semantic-ui-react');

var _search = require('../../helpers/search');

var _search2 = require('../../redux/modules/search');

var _settings = require('../../redux/modules/settings');

var _shapes = require('../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _consts = require('../../helpers/consts');

var _filters = require('../../redux/modules/filters');

var _filters2 = require('../../filters');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CATEGORIES_ICONS = {
  'search': 'search',
  'tags': 'tags',
  'sources': 'book',
  'authors': 'student',
  'persons': 'user'
};

var OmniBox = function (_Component) {
  _inherits(OmniBox, _Component);

  function OmniBox() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, OmniBox);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = OmniBox.__proto__ || Object.getPrototypeOf(OmniBox)).call.apply(_ref, [this].concat(args))), _this), _this.resetComponent = function (query) {
      return _this.setState({ suggestionsHelper: new _search.SuggestionsHelper(), query: query });
    }, _this.doAutocomplete = (0, _debounce2.default)(function () {
      var query = _this.props.query;
      if (query.trim()) {
        _this.props.autocomplete(query);
      } else {
        _this.resetComponent('');
      }
    }, 100), _this.emptyQuery = function () {
      var query = _this.props.query;
      var filters = _this.props.filters;

      var params = _filters2.filtersTransformer.toApiParams(filters);
      return !query && !Object.values(params).length;
    }, _this.doSearch = function () {
      var q = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var query = q != null ? q : _this.props.query;
      var _this$props = _this.props,
          search = _this$props.search,
          location = _this$props.location,
          push = _this$props.push,
          pageSize = _this$props.pageSize;


      if (_this.emptyQuery()) {
        return;
      }

      search(query, 1, pageSize);

      // redirect to search results page if we're not there
      if (!location.pathname.endsWith('search')) {
        push('search');
      }

      if (_this.state.isOpen) {
        _this.setState({ isOpen: false });
      }
    }, _this.handleResultSelect = function (e, data) {
      console.log('handleResultSelect');
      var key = data.result.key;
      var category = data.results.find(function (c) {
        return c.results.find(function (r) {
          return r.key === key;
        });
      }).name;
      if (category === 'search') {
        _this.props.updateQuery(data.result.title);
        _this.doSearch(data.result.title);
      } else if (category === 'tags') {
        _this.props.updateQuery('');
        _this.props.addFilterValue('search', 'topics-filter', data.result.key);
        _this.doSearch('');
      }
      // Currently ignoring anything else (sources for example).
    }, _this.handleSearchKeyDown = function (e, data) {
      // Fix bug that did not allows to handleResultSelect when string is empty
      // we have meaning for that when filters are not empty.
      if (e.keyCode === 13 && !_this.props.query.trim()) {
        _this.doSearch();
      }
    }, _this.handleSearchChange = function (e, data) {
      _this.props.updateQuery(data.value);
      if (data.value.trim()) {
        _this.setState({ isOpen: true }, _this.doAutocomplete);
      } else {
        _this.setState({ isOpen: false });
      }
    }, _this.handleIconClick = function () {
      _this.doSearch();
    }, _this.suggestionToResult = function (type, item) {
      return { key: item.id, title: item.text };
    }, _this.renderCategory = function (category) {
      var name = category.name;

      var icon = CATEGORIES_ICONS[name];
      return _react2.default.createElement(
        'div',
        { style: { paddingTop: '0.5em' } },
        _react2.default.createElement(_semanticUiReact.Icon, { name: icon }),
        _this.props.t('search.suggestions.categories.' + name)
      );
    }, _this.dontBlur = function () {
      _this.setState({ dontBlur: true });
    }, _this.closeSuggestions = function (e, data) {
      if (_this.state.dontBlur) {
        _this.setState({ dontBlur: false });
      } else {
        _this.setState({ isOpen: false, dontBlur: false });
      }
    }, _this.resultRTL = function (language, result) {
      return Object.assign({}, result, {
        className: _consts.RTL_LANGUAGES.includes(language) ? 'search-result-rtl' : undefined
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(OmniBox, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.resetComponent(this.props.query);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.suggestions !== this.props.suggestions) {
        this.setState({ suggestionsHelper: new _search.SuggestionsHelper(nextProps.suggestions) });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          language = _props.language,
          query = _props.query;
      var _state = this.state,
          suggestionsHelper = _state.suggestionsHelper,
          isOpen = _state.isOpen;


      var categories = ['tags', /*'sources', - ignore sources for now */'authors', 'persons'];
      var textResults = new Set([query]);
      var results = categories.reduce(function (acc, val) {
        var searchResults = suggestionsHelper.getSuggestions(val, 5);
        if (searchResults.length > 0) {
          searchResults.forEach(function (x) {
            return textResults.add(x.text);
          });
          acc.push({
            name: val,
            results: searchResults.map(function (x) {
              return _this2.resultRTL(x.language, _this2.suggestionToResult(val, x));
            }),
            onMouseDown: _this2.dontBlur
          });
        }

        return acc;
      }, []);
      results = [{
        name: 'search',
        results: Array.from(textResults).map(function (q) {
          return _this2.resultRTL(language, { key: 'search_' + q, title: q });
        }),
        onMouseDown: this.dontBlur
      }].concat(results);

      return _react2.default.createElement(_semanticUiReact.Search, {
        className: 'search-omnibox',
        category: true,
        fluid: true,
        results: results,
        value: query,
        open: isOpen,
        selectFirstResult: true,
        categoryRenderer: this.renderCategory,
        onSearchChange: this.handleSearchChange,
        onFocus: this.handleSearchChange,
        onResultSelect: this.handleResultSelect,
        onBlur: this.closeSuggestions,
        input: _react2.default.createElement(_semanticUiReact.Input, { onKeyDown: this.handleSearchKeyDown, style: { width: '100%' } }),
        icon: _react2.default.createElement(_semanticUiReact.Icon, { link: true, name: 'search', onClick: this.handleIconClick }),
        size: 'mini',
        showNoResults: false
      });
    }
  }]);

  return OmniBox;
}(_react.Component);

OmniBox.propTypes = {
  addFilterValue: _propTypes2.default.func.isRequired,
  location: shapes.HistoryLocation.isRequired,
  autocomplete: _propTypes2.default.func.isRequired,
  search: _propTypes2.default.func.isRequired,
  push: _propTypes2.default.func.isRequired,
  t: _propTypes2.default.func.isRequired,
  suggestions: _propTypes2.default.array,
  getSourcePath: _propTypes2.default.func,
  getTagPath: _propTypes2.default.func,
  query: _propTypes2.default.string.isRequired,
  language: _propTypes2.default.string.isRequired,
  pageSize: _propTypes2.default.number.isRequired,
  filters: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired
};
OmniBox.defaultProps = {
  suggestions: []
};


var mapState = function mapState(state) {
  return {
    suggestions: _search2.selectors.getSuggestions(state.search),
    query: _search2.selectors.getQuery(state.search),
    pageSize: _settings.selectors.getPageSize(state.settings),
    language: _settings.selectors.getLanguage(state.settings),
    filters: _filters.selectors.getFilters(state.filters, 'search')
  };
};

var mapDispatch = function mapDispatch(dispatch) {
  return (0, _redux.bindActionCreators)({
    autocomplete: _search2.actions.autocomplete,
    search: _search2.actions.search,
    updateQuery: _search2.actions.updateQuery,
    addFilterValue: _filters.actions.addFilterValue,
    push: _reactRouterRedux.push
  }, dispatch);
};

exports.default = (0, _reactRedux.connect)(mapState, mapDispatch)(OmniBox);
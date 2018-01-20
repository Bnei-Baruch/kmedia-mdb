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

var _semanticUiReact = require('semantic-ui-react');

var _search = require('../../redux/modules/search');

var _settings = require('../../redux/modules/settings');

var _mdb = require('../../redux/modules/mdb');

var _shapes = require('../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _SearchResults = require('./SearchResults');

var _SearchResults2 = _interopRequireDefault(_SearchResults);

var _Filters = require('./Filters');

var _Filters2 = _interopRequireDefault(_Filters);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchResultsContainer = function (_Component) {
  _inherits(SearchResultsContainer, _Component);

  function SearchResultsContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SearchResultsContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SearchResultsContainer.__proto__ || Object.getPrototypeOf(SearchResultsContainer)).call.apply(_ref, [this].concat(args))), _this), _this.handlePageChange = function (pageNo) {
      var _this$props = _this.props,
          setPage = _this$props.setPage,
          search = _this$props.search,
          query = _this$props.query,
          pageSize = _this$props.pageSize;

      setPage(pageNo);
      search(query, pageNo, pageSize);
    }, _this.handleSortByChanged = function (e, data) {
      var _this$props2 = _this.props,
          setSortBy = _this$props2.setSortBy,
          search = _this$props2.search,
          query = _this$props2.query,
          pageSize = _this$props2.pageSize,
          pageNo = _this$props2.pageNo;

      setSortBy(data.value);
      search(query, pageNo, pageSize);
    }, _this.handleFiltersChanged = function () {
      _this.handlePageChange(1);
    }, _this.handleFiltersHydrated = function () {
      var _this$props3 = _this.props,
          search = _this$props3.search,
          query = _this$props3.query,
          pageSize = _this$props3.pageSize,
          pageNo = _this$props3.pageNo;

      search(query, pageNo, pageSize);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SearchResultsContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.hydrateUrl();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          wip = _props.wip,
          err = _props.err,
          results = _props.results,
          cuMap = _props.cuMap,
          pageNo = _props.pageNo,
          pageSize = _props.pageSize,
          sortBy = _props.sortBy,
          language = _props.language;


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Filters2.default, {
          sortBy: sortBy,
          onChange: this.handleFiltersChanged,
          onSortByChange: this.handleSortByChanged,
          onHydrated: this.handleFiltersHydrated
        }),
        _react2.default.createElement(
          _semanticUiReact.Container,
          { className: 'padded' },
          _react2.default.createElement(_SearchResults2.default, {
            results: results,
            cuMap: cuMap,
            wip: wip,
            err: err,
            pageNo: pageNo,
            pageSize: pageSize,
            language: language,
            handlePageChange: this.handlePageChange
          })
        )
      );
    }
  }]);

  return SearchResultsContainer;
}(_react.Component);

SearchResultsContainer.propTypes = {
  query: _propTypes2.default.string.isRequired,
  results: _propTypes2.default.object,
  cuMap: _propTypes2.default.objectOf(shapes.ContentUnit),
  wip: shapes.WIP,
  err: shapes.Error,
  search: _propTypes2.default.func.isRequired,
  setPage: _propTypes2.default.func.isRequired,
  pageNo: _propTypes2.default.number.isRequired,
  pageSize: _propTypes2.default.number.isRequired,
  sortBy: _propTypes2.default.string.isRequired,
  hydrateUrl: _propTypes2.default.func.isRequired,
  language: _propTypes2.default.string.isRequired
};
SearchResultsContainer.defaultProps = {
  results: null,
  wip: false,
  err: null
};


var mapState = function mapState(state) {
  var results = _search.selectors.getResults(state.search);
  var cuMap = results && results.hits && Array.isArray(results.hits.hits) ? results.hits.hits.reduce(function (acc, val) {
    var cuID = val._source.mdb_uid;
    acc[cuID] = _mdb.selectors.getDenormContentUnit(state.mdb, cuID);
    return acc;
  }, {}) : {};

  return {
    results: results,
    cuMap: cuMap,
    query: _search.selectors.getQuery(state.search),
    pageNo: _search.selectors.getPageNo(state.search),
    sortBy: _search.selectors.getSortBy(state.search),
    pageSize: _settings.selectors.getPageSize(state.settings),
    language: _settings.selectors.getLanguage(state.settings),
    wip: _search.selectors.getWip(state.search),
    err: _search.selectors.getError(state.search)
  };
};

var mapDispatch = function mapDispatch(dispatch) {
  return (0, _redux.bindActionCreators)({
    search: _search.actions.search,
    setPage: _search.actions.setPage,
    setSortBy: _search.actions.setSortBy,
    hydrateUrl: _search.actions.hydrateUrl
  }, dispatch);
};

exports.default = (0, _reactRedux.connect)(mapState, mapDispatch)(SearchResultsContainer);
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-duration-format');

var _reactI18next = require('react-i18next');

var _semanticUiReact = require('semantic-ui-react');

var _utils = require('../../helpers/utils');

var _url = require('../../helpers/url');

var _filters = require('../../redux/modules/filters');

var _filters2 = require('../../filters');

var _shapes = require('../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _Splash = require('../shared/Splash');

var _MultiLanguageLink = require('../Language/MultiLanguageLink');

var _MultiLanguageLink2 = _interopRequireDefault(_MultiLanguageLink);

var _Pagination = require('../pagination/Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchResults = function (_Component) {
  _inherits(SearchResults, _Component);

  function SearchResults() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SearchResults);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SearchResults.__proto__ || Object.getPrototypeOf(SearchResults)).call.apply(_ref, [this].concat(args))), _this), _this.renderHit = function (hit) {
      var _this$props = _this.props,
          cuMap = _this$props.cuMap,
          t = _this$props.t;
      var src = hit._source,
          highlight = hit.highlight,
          score = hit._score;


      var name = src.name;
      if (highlight && Array.isArray(highlight.name) && highlight.name.length > 0) {
        name = _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: highlight.name.join(' ') } });
      }

      var description = src.description;
      if (highlight && Array.isArray(highlight.description) && highlight.description.length > 0) {
        description = _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: highlight.description.join(' ') } });
      }

      var filmDate = '';
      if (src.film_date) {
        filmDate = t('values.date', { date: new Date(src.film_date) });
      }

      return _react2.default.createElement(
        _semanticUiReact.Table.Row,
        { key: src.mdb_uid, verticalAlign: 'top' },
        _react2.default.createElement(
          _semanticUiReact.Table.Cell,
          { collapsing: true, singleLine: true, width: 1 },
          _react2.default.createElement(
            'strong',
            null,
            filmDate
          )
        ),
        _react2.default.createElement(
          _semanticUiReact.Table.Cell,
          null,
          _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement(
              _semanticUiReact.Label,
              null,
              t('constants.content-types.' + src.content_type)
            ),
            _react2.default.createElement(
              _MultiLanguageLink2.default,
              { to: (0, _utils.canonicalLink)(cuMap[src.mdb_uid] || { id: src.mdb_uid, content_type: src.content_type }) },
              name
            ),
            '\xA0\xA0',
            src.duration ? _react2.default.createElement(
              'small',
              null,
              _moment2.default.duration(src.duration, 'seconds').format('hh:mm:ss')
            ) : null
          ),
          description ? _react2.default.createElement(
            'div',
            null,
            description
          ) : null
        ),
        _react2.default.createElement(
          _semanticUiReact.Table.Cell,
          { collapsing: true, textAlign: 'right' },
          score
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SearchResults, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          filters = _props.filters,
          wip = _props.wip,
          err = _props.err,
          results = _props.results,
          pageNo = _props.pageNo,
          pageSize = _props.pageSize,
          language = _props.language,
          t = _props.t,
          handlePageChange = _props.handlePageChange;

      // Query from URL (not changed until pressed Enter.

      var query = (0, _url.getQuery)(window.location).q;

      if (err) {
        return _react2.default.createElement(_Splash.ErrorSplash, { text: t('messages.server-error'), subtext: (0, _utils.formatError)(err) });
      }

      if (wip) {
        return _react2.default.createElement(_Splash.LoadingSplash, { text: t('messages.loading'), subtext: t('messages.loading-subtext') });
      }

      if (query === '' && !Object.values(_filters2.filtersTransformer.toApiParams(filters)).length) {
        return _react2.default.createElement(
          'div',
          null,
          t('search.results.empty-query')
        );
      }

      if ((0, _utils.isEmpty)(results)) {
        return null;
      }

      var took = results.took,
          _results$hits = results.hits,
          total = _results$hits.total,
          hits = _results$hits.hits;

      if (total === 0) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_semanticUiReact.Header, { as: 'h1', content: t('search.results.title') }),
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              _reactI18next.Trans,
              { i18nKey: 'search.results.no-results' },
              'Your search for ',
              _react2.default.createElement(
                'strong',
                { style: { fontStyle: 'italic' } },
                { query: query }
              ),
              ' found no results.'
            )
          )
        );
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _semanticUiReact.Header,
          { as: 'h1' },
          t('search.results.title'),
          _react2.default.createElement(
            _semanticUiReact.Header.Subheader,
            null,
            t('search.results.search-summary', { total: total, pageNo: pageNo, took: took / 1000 })
          )
        ),
        _react2.default.createElement(
          _semanticUiReact.Table,
          { sortable: true, basic: 'very', className: 'index-list' },
          _react2.default.createElement(
            _semanticUiReact.Table.Body,
            null,
            hits.map(this.renderHit)
          )
        ),
        _react2.default.createElement(_semanticUiReact.Divider, { fitted: true }),
        _react2.default.createElement(
          _semanticUiReact.Container,
          { className: 'padded', textAlign: 'center' },
          _react2.default.createElement(_Pagination2.default, {
            pageNo: pageNo,
            pageSize: pageSize,
            total: total,
            language: language,
            onChange: handlePageChange
          })
        )
      );
    }
  }]);

  return SearchResults;
}(_react.Component);

SearchResults.propTypes = {
  results: _propTypes2.default.object,
  cuMap: _propTypes2.default.objectOf(shapes.ContentUnit),
  pageNo: _propTypes2.default.number.isRequired,
  pageSize: _propTypes2.default.number.isRequired,
  language: _propTypes2.default.string.isRequired,
  wip: shapes.WIP,
  err: shapes.Error,
  t: _propTypes2.default.func.isRequired,
  handlePageChange: _propTypes2.default.func.isRequired,
  filters: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired
};
SearchResults.defaultProps = {
  results: null,
  cuMap: {},
  wip: false,
  err: null
};
exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    filters: _filters.selectors.getFilters(state.filters, 'search')
  };
})((0, _reactI18next.translate)()(SearchResults));
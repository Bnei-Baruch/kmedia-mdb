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

var _programs = require('../../../redux/modules/programs');

var _mdb = require('../../../redux/modules/mdb');

var _settings = require('../../../redux/modules/settings');

var _filters = require('../../../redux/modules/filters');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _withPagination = require('../../pagination/withPagination');

var _withPagination2 = _interopRequireDefault(_withPagination);

var _FullProgram = require('./FullProgram');

var _FullProgram2 = _interopRequireDefault(_FullProgram);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FullProgramContainer = function (_Component) {
  _inherits(FullProgramContainer, _Component);

  function FullProgramContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FullProgramContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FullProgramContainer.__proto__ || Object.getPrototypeOf(FullProgramContainer)).call.apply(_ref, [this].concat(args))), _this), _this.fetchCollection = function (props) {
      var match = props.match,
          fetchFullProgram = props.fetchFullProgram;

      fetchFullProgram(match.params.id);
    }, _this.fetchChapters = function (props) {
      var match = props.match,
          pageNo = props.pageNo,
          pageSize = props.pageSize,
          language = props.language,
          fetchFullProgramList = props.fetchFullProgramList;

      fetchFullProgramList(pageNo, pageSize, language, match.params.id);
    }, _this.setAndFetchPage = function (props, pageNo) {
      props.setFullProgramPage(pageNo);
      _this.fetchChapters(Object.assign({}, props, { pageNo: pageNo }));
    }, _this.handlePageChanged = function (pageNo) {
      _this.setAndFetchPage(_this.props, pageNo);
    }, _this.handleFiltersChanged = function () {
      _this.setAndFetchPage(_this.props, 1);
    }, _this.handleFiltersHydrated = function () {
      var pageNo = _withPagination2.default.getPageNo({ location: _this.props.location });
      _this.handlePageChanged(pageNo);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FullProgramContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.fetchCollection(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.match.params.id !== this.props.match.params.id) {
        this.fetchCollection(nextProps);
      }

      if (nextProps.language !== this.props.language) {
        this.fetchCollection(nextProps);
      }

      // filters haven't been hydrated yet.
      // returning here prevents duplicate calls to fetchChapters.
      if (!nextProps.isFiltersHydrated) {
        return;
      }

      if (nextProps.fullProgram && !this.props.fullProgram) {
        this.fetchChapters(nextProps);
      }

      if (nextProps.pageSize !== this.props.pageSize) {
        this.setAndFetchPage(nextProps, 1);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          fullProgram = _props.fullProgram,
          wip = _props.wip,
          err = _props.err,
          items = _props.items,
          itemsWip = _props.itemsWip,
          itemsErr = _props.itemsErr,
          pageNo = _props.pageNo,
          total = _props.total,
          pageSize = _props.pageSize,
          language = _props.language;


      return _react2.default.createElement(_FullProgram2.default, {
        fullProgram: fullProgram,
        wip: wip,
        err: err,
        items: items,
        itemsWip: itemsWip,
        itemsErr: itemsErr,
        pageNo: pageNo,
        total: total,
        pageSize: pageSize,
        language: language,
        onPageChange: this.handlePageChanged,
        onFiltersChanged: this.handleFiltersChanged,
        onFiltersHydrated: this.handleFiltersHydrated
      });
    }
  }]);

  return FullProgramContainer;
}(_react.Component);

FullProgramContainer.propTypes = {
  location: shapes.HistoryLocation.isRequired,
  match: shapes.RouterMatch.isRequired,
  fullProgram: shapes.ProgramCollection,
  wip: _propTypes2.default.bool,
  err: shapes.Error,
  items: _propTypes2.default.arrayOf(shapes.ProgramChapter),
  total: _propTypes2.default.number.isRequired,
  pageNo: _propTypes2.default.number.isRequired,
  itemsWip: _propTypes2.default.bool,
  itemsErr: shapes.Error,
  pageSize: _propTypes2.default.number.isRequired,
  language: _propTypes2.default.string.isRequired,
  isFiltersHydrated: _propTypes2.default.bool,
  fetchFullProgram: _propTypes2.default.func.isRequired,
  fetchFullProgramList: _propTypes2.default.func.isRequired,
  setFullProgramPage: _propTypes2.default.func.isRequired
};
FullProgramContainer.defaultProps = {
  fullProgram: null,
  wip: false,
  err: null,
  items: [],
  itemsWip: false,
  itemsErr: null,
  isFiltersHydrated: false
};


function mapState(state, props) {
  var id = props.match.params.id;
  var fullProgram = _mdb.selectors.getDenormCollection(state.mdb, id);
  var wipMap = _programs.selectors.getWip(state.programs);
  var errMap = _programs.selectors.getErrors(state.programs);
  var paging = _programs.selectors.getFullPaging(state.programs);

  return {
    fullProgram: fullProgram,
    wip: wipMap.fulls[id],
    err: errMap.fulls[id],
    items: paging.items.map(function (x) {
      return _mdb.selectors.getDenormContentUnit(state.mdb, x);
    }),
    total: paging.total,
    pageNo: paging.pageNo,
    itemsWip: wipMap.fullList,
    itemsErr: errMap.fullList,
    pageSize: _settings.selectors.getPageSize(state.settings),
    language: _settings.selectors.getLanguage(state.settings),
    isFiltersHydrated: _filters.selectors.getIsHydrated(state.filters, 'full-program')
  };
}

function mapDispatch(dispatch) {
  return (0, _redux.bindActionCreators)({
    fetchFullProgram: _programs.actions.fetchFullProgram,
    fetchFullProgramList: _programs.actions.fetchFullProgramList,
    setFullProgramPage: _programs.actions.setFullProgramPage
  }, dispatch);
}

exports.default = (0, _reactRedux.connect)(mapState, mapDispatch)(FullProgramContainer);
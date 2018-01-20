'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _programs = require('../../../redux/modules/programs');

var _settings = require('../../../redux/modules/settings');

var _mdb = require('../../../redux/modules/mdb');

var _filters = require('../../../redux/modules/filters');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _withPagination2 = require('../../pagination/withPagination');

var _withPagination3 = _interopRequireDefault(_withPagination2);

var _Programs = require('./Programs');

var _Programs2 = _interopRequireDefault(_Programs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProgramsContainer = function (_withPagination) {
  _inherits(ProgramsContainer, _withPagination);

  function ProgramsContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ProgramsContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ProgramsContainer.__proto__ || Object.getPrototypeOf(ProgramsContainer)).call.apply(_ref, [this].concat(args))), _this), _this.handlePageChanged = function (pageNo) {
      return _withPagination3.default.handlePageChange(_this.props, pageNo);
    }, _this.handleFiltersChanged = function () {
      return _withPagination3.default.handlePageChange(_this.props, 1);
    }, _this.handleFiltersHydrated = function () {
      _withPagination3.default.handlePageChange(_this.props);

      if (_this.props.shouldOpenProgramsFilter) {
        _this.props.editNewFilter('programs', 'programs-filter');
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ProgramsContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // If filters are already hydrated, handleFiltersHydrated won't be called.
      // We'll have to ask for data here instead.
      if (this.props.isFiltersHydrated) {
        _withPagination3.default.askForData(this.props);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var language = nextProps.language;


      if (language !== this.props.language) {
        _withPagination3.default.askForData(nextProps);
      }

      _get(ProgramsContainer.prototype.__proto__ || Object.getPrototypeOf(ProgramsContainer.prototype), 'componentWillReceiveProps', this).call(this, nextProps);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          items = _props.items,
          wip = _props.wip,
          err = _props.err,
          pageNo = _props.pageNo,
          total = _props.total,
          pageSize = _props.pageSize,
          language = _props.language;


      return _react2.default.createElement(_Programs2.default, {
        items: items,
        wip: wip,
        err: err,
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

  return ProgramsContainer;
}(_withPagination3.default);

ProgramsContainer.propTypes = {
  location: shapes.HistoryLocation.isRequired,
  items: _propTypes2.default.arrayOf(shapes.ProgramChapter),
  wip: shapes.WIP,
  err: shapes.Error,
  pageNo: _propTypes2.default.number.isRequired,
  total: _propTypes2.default.number.isRequired,
  pageSize: _propTypes2.default.number.isRequired,
  language: _propTypes2.default.string.isRequired,
  isFiltersHydrated: _propTypes2.default.bool,
  shouldOpenProgramsFilter: _propTypes2.default.bool,
  fetchList: _propTypes2.default.func.isRequired,
  setPage: _propTypes2.default.func.isRequired,
  editNewFilter: _propTypes2.default.func.isRequired
};
ProgramsContainer.defaultProps = {
  items: [],
  isFiltersHydrated: false,
  shouldOpenProgramsFilter: true
};


var mapState = function mapState(state) {
  var paging = _withPagination3.default.mapState('programs', state, _programs.selectors, _settings.selectors);

  // we want to open programs-filter if no filter is applied
  var allFilters = _filters.selectors.getFilters(state.filters, 'programs');
  var shouldOpenProgramsFilter = allFilters.length === 0;

  return {
    items: _programs.selectors.getItems(state.programs).map(function (x) {
      return _mdb.selectors.getDenormContentUnit(state.mdb, x);
    }),
    wip: _programs.selectors.getWip(state.programs).list,
    err: _programs.selectors.getErrors(state.programs).list,
    pageNo: paging.pageNo,
    total: paging.total,
    pageSize: _settings.selectors.getPageSize(state.settings),
    language: _settings.selectors.getLanguage(state.settings),
    isFiltersHydrated: _filters.selectors.getIsHydrated(state.filters, 'programs'),
    shouldOpenProgramsFilter: shouldOpenProgramsFilter
  };
};

function mapDispatch(dispatch) {
  return (0, _redux.bindActionCreators)({
    fetchList: _programs.actions.fetchList,
    setPage: _programs.actions.setPage,
    editNewFilter: _filters.actions.editNewFilter
  }, dispatch);
}

exports.default = (0, _reactRedux.connect)(mapState, mapDispatch)(ProgramsContainer);
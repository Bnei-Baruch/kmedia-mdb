'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _shapes = require('../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _Pagination = require('./Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _ResultsPageHeader = require('./ResultsPageHeader');

var _ResultsPageHeader2 = _interopRequireDefault(_ResultsPageHeader);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var withPagination = function (_React$Component) {
  _inherits(withPagination, _React$Component);

  function withPagination() {
    _classCallCheck(this, withPagination);

    return _possibleConstructorReturn(this, (withPagination.__proto__ || Object.getPrototypeOf(withPagination)).apply(this, arguments));
  }

  _createClass(withPagination, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var pageSize = nextProps.pageSize;


      if (pageSize !== this.props.pageSize) {
        withPagination.handlePageChange(nextProps, 1);
      }
    }
  }]);

  return withPagination;
}(_react2.default.Component);

withPagination.propTypes = {
  pageNo: _propTypes2.default.number.isRequired,
  total: _propTypes2.default.number.isRequired,
  pageSize: _propTypes2.default.number.isRequired,
  setPage: _propTypes2.default.func.isRequired,
  location: shapes.HistoryLocation.isRequired,
  language: _propTypes2.default.string.isRequired,
  fetchList: _propTypes2.default.func.isRequired,
  contentTypes: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
  id: _propTypes2.default.string
};
withPagination.defaultProps = {
  id: null
};

withPagination.mapState = function (namespace, state, selectors, settings) {
  return {
    pageNo: selectors.getPageNo(state[namespace]),
    total: selectors.getTotal(state[namespace]),
    pageSize: settings.getPageSize(state.settings)
  };
};

withPagination.Pagination = function (props) {
  return _react2.default.createElement(_Pagination2.default, Object.assign({}, props, { onChange: function onChange(x) {
      return withPagination.handlePageChange(props, x);
    } }));
};

withPagination.ResultsPageHeader = function (props) {
  return _react2.default.createElement(_ResultsPageHeader2.default, props);
};

withPagination.getPageNo = function (props) {
  var search = props.location.search;

  var page = 0;
  if (search) {
    var match = search.match(/page=(\d+)/);
    if (match) {
      page = parseInt(match[1], 10);
    }
  }

  return isNaN(page) || page <= 0 ? 1 : page;
};

withPagination.askForData = function (props) {
  var fetchList = props.fetchList,
      _props$pageNo = props.pageNo,
      pageNo = _props$pageNo === undefined ? withPagination.getPageNo(props) : _props$pageNo,
      language = props.language,
      pageSize = props.pageSize,
      contentTypes = props.contentTypes,
      id = props.id;

  fetchList({
    pageNo: pageNo,
    language: language,
    pageSize: pageSize,
    contentTypes: contentTypes,
    id: id
  });
};

withPagination.handlePageChange = function (props) {
  var pageNo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : withPagination.getPageNo(props);
  var setPage = props.setPage;

  setPage(pageNo);
  var data = Object.assign({}, props, {
    pageNo: pageNo // props includes _previous_ page number
  });
  withPagination.askForData(data);
};

exports.default = withPagination;
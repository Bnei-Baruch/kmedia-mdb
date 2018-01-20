'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _utils = require('../../../../helpers/utils');

var _sources = require('../../../../redux/modules/sources');

var _settings = require('../../../../redux/modules/settings');

var _shapes = require('../../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _Sources = require('./Sources');

var _Sources2 = _interopRequireDefault(_Sources);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SourcesContainer = function (_Component) {
  _inherits(SourcesContainer, _Component);

  function SourcesContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SourcesContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SourcesContainer.__proto__ || Object.getPrototypeOf(SourcesContainer)).call.apply(_ref, [this].concat(args))), _this), _this.fetchIndices = function (props) {
      var indexMap = props.indexMap,
          fetchIndex = props.fetchIndex;

      Object.entries(indexMap).forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            k = _ref3[0],
            v = _ref3[1];

        if ((0, _utils.isEmpty)(v)) {
          fetchIndex(k);
        }
      });
    }, _this.handleContentChange = function (id, name) {
      _this.props.fetchContent(id, name);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SourcesContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.fetchIndices(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.unit.sources !== this.props.unit.sources) {
        this.fetchIndices(nextProps);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          unit = _props.unit,
          indexMap = _props.indexMap,
          content = _props.content,
          language = _props.language,
          t = _props.t,
          getSourceById = _props.getSourceById;


      return _react2.default.createElement(_Sources2.default, {
        unit: unit,
        indexMap: indexMap,
        content: content,
        language: language,
        t: t,
        getSourceById: getSourceById,
        onContentChange: this.handleContentChange
      });
    }
  }]);

  return SourcesContainer;
}(_react.Component);

SourcesContainer.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  indexMap: _propTypes2.default.objectOf(_propTypes2.default.shape({
    data: _propTypes2.default.object, // content index
    wip: shapes.WIP,
    err: shapes.Error
  })),
  content: _propTypes2.default.shape({
    data: _propTypes2.default.string, // actual content (HTML)
    wip: shapes.WIP,
    err: shapes.Error
  }),
  language: _propTypes2.default.string.isRequired,
  t: _propTypes2.default.func.isRequired,
  fetchIndex: _propTypes2.default.func.isRequired,
  fetchContent: _propTypes2.default.func.isRequired,
  getSourceById: _propTypes2.default.func.isRequired
};
SourcesContainer.defaultProps = {
  indexMap: {},
  content: {
    data: null,
    wip: false,
    err: null
  }
};
exports.default = (0, _reactRedux.connect)(function (state, ownProps) {
  var indexById = _sources.selectors.getIndexById(state.sources);
  var indexMap = (ownProps.unit.sources || []).reduce(function (acc, val) {
    acc[val] = indexById[val];
    return acc;
  }, {});

  return {
    indexMap: indexMap,
    content: _sources.selectors.getContent(state.sources),
    language: _settings.selectors.getLanguage(state.settings),
    getSourceById: _sources.selectors.getSourceById(state.sources)
  };
}, function (dispatch) {
  return (0, _redux.bindActionCreators)({
    fetchIndex: _sources.actions.fetchIndex,
    fetchContent: _sources.actions.fetchContent
  }, dispatch);
})(SourcesContainer);
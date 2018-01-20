'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assetUrl = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API_BACKEND = process.env.NODE_ENV === 'production' ? '/backend/' : process.env.REACT_APP_API_BACKEND;

var ASSETS_BACKEND = process.env.NODE_ENV === 'production' ? '/assets/' : process.env.REACT_APP_ASSETS_BACKEND;

var assetUrl = exports.assetUrl = function assetUrl(path) {
  return '' + ASSETS_BACKEND + path;
};

var Requests = function Requests() {
  _classCallCheck(this, Requests);
};

Requests.get = function (path) {
  return (0, _axios2.default)('' + API_BACKEND + path);
};

Requests.getAsset = function (path) {
  return (0, _axios2.default)(assetUrl(path));
};

Requests.makeParams = function (params) {
  return '' + Object.entries(params).filter(function (_ref12) {
    var _ref13 = _slicedToArray(_ref12, 2),
        k = _ref13[0],
        v = _ref13[1];

    return v !== undefined && v !== null;
  }).map(function (pair) {
    var key = pair[0];
    var value = pair[1];

    if (Array.isArray(value)) {
      return value.map(function (val) {
        return key + '=' + val;
      }).join('&');
    }

    return key + '=' + value;
  }).join('&');
};

Requests.encode = encodeURIComponent;

var Api = function Api() {
  _classCallCheck(this, Api);
};

Api.collection = function (_ref) {
  var id = _ref.id,
      language = _ref.language;
  return Requests.get('collections/' + id + '?' + Requests.makeParams({ language: language }));
};

Api.unit = function (_ref2) {
  var id = _ref2.id,
      language = _ref2.language;
  return Requests.get('content_units/' + id + '?' + Requests.makeParams({ language: language }));
};

Api.sources = function (_ref3) {
  var language = _ref3.language;
  return Requests.get('sources?' + Requests.makeParams({ language: language }));
};

Api.tags = function (_ref4) {
  var language = _ref4.language;
  return Requests.get('tags?' + Requests.makeParams({ language: language }));
};

Api.lessons = function (_ref5) {
  var page_no = _ref5.pageNo,
      page_size = _ref5.pageSize,
      rest = _objectWithoutProperties(_ref5, ['pageNo', 'pageSize']);

  return Requests.get('lessons?' + Requests.makeParams(Object.assign({ page_no: page_no, page_size: page_size }, rest)));
};

Api.collections = function (_ref6) {
  var content_type = _ref6.contentTypes,
      page_no = _ref6.pageNo,
      page_size = _ref6.pageSize,
      rest = _objectWithoutProperties(_ref6, ['contentTypes', 'pageNo', 'pageSize']);

  return Requests.get('collections?' + Requests.makeParams(Object.assign({ page_no: page_no, page_size: page_size, content_type: content_type }, rest)));
};

Api.units = function (_ref7) {
  var content_type = _ref7.contentTypes,
      page_no = _ref7.pageNo,
      page_size = _ref7.pageSize,
      rest = _objectWithoutProperties(_ref7, ['contentTypes', 'pageNo', 'pageSize']);

  return Requests.get('content_units?' + Requests.makeParams(Object.assign({ page_no: page_no, page_size: page_size, content_type: content_type }, rest)));
};

Api.recentlyUpdated = function () {
  return Requests.get('recently_updated');
};

Api.autocomplete = function (_ref8) {
  var q = _ref8.q,
      language = _ref8.language;
  return Requests.get('autocomplete?' + Requests.makeParams({ q: q, language: language }));
};

Api.search = function (_ref9) {
  var q = _ref9.q,
      language = _ref9.language,
      page_no = _ref9.pageNo,
      page_size = _ref9.pageSize,
      sort_by = _ref9.sortBy;
  return Requests.get('search?' + Requests.makeParams({ q: q, language: language, page_no: page_no, page_size: page_size, sort_by: sort_by }));
};

Api.sourceIdx = function (_ref10) {
  var id = _ref10.id;
  return Requests.getAsset('sources/' + id + '/index.json');
};

Api.sourceContent = function (_ref11) {
  var id = _ref11.id,
      name = _ref11.name;
  return Requests.getAsset('sources/' + id + '/' + name);
};

exports.default = Api;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _keyBy = require('lodash/keyBy');

var _keyBy2 = _interopRequireDefault(_keyBy);

var _compact = require('lodash/compact');

var _compact2 = _interopRequireDefault(_compact);

var _castArray = require('lodash/castArray');

var _castArray2 = _interopRequireDefault(_castArray);

var _utils = require('../helpers/utils');

var _definitions = require('./definitions');

var definitions = _interopRequireWildcard(_definitions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var compactMap = function compactMap(values, transform) {
  return (0, _compact2.default)(values.map(transform));
};

var filterValuesToQueryValues = function filterValuesToQueryValues(definition) {
  var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return compactMap((0, _castArray2.default)(values), function (arg) {
    return definition.valueToQuery(arg);
  });
};
var queryValuesToFilterValues = function queryValuesToFilterValues(definition) {
  var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return compactMap((0, _castArray2.default)(values), function (arg) {
    return definition.queryToValue(arg);
  });
};

function filterValuesToApiParams(definition) {
  var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var transformedValues = (0, _castArray2.default)(values).map(definition.valueToApiParam);
  return transformedValues.reduce(function (acc, param) {
    Object.keys(param).forEach(function (key) {
      var value = param[key];
      if (Array.isArray(acc[key])) {
        acc[key].push(value);
      } else {
        acc[key] = [value];
      }
    });
    return acc;
  }, {});
}

var filtersTransformer = {
  definitionsByName: (0, _keyBy2.default)(definitions, 'name'),
  queryKeyToName: (0, _reduce2.default)(definitions, function (acc, definition) {
    return Object.assign(acc, _defineProperty({}, definition.queryKey, definition.name));
  }, {}),
  toQueryParams: function toQueryParams(filters /* arrayOf({ name: string, values: array }) */) {
    var _this = this;

    var queryParams = filters.reduce(function (acc, filter) {
      var definition = _this.definitionsByName[filter.name];
      var paramValues = filterValuesToQueryValues(definition, filter.values);
      return Object.assign(acc, _defineProperty({}, definition.queryKey, paramValues));
    }, {});

    return queryParams;
  },
  fromQueryParams: function fromQueryParams(queryParams) {
    var _this2 = this;

    return Object.keys(queryParams).reduce(function (acc, key) {
      var filterName = _this2.queryKeyToName[key];
      var definition = _this2.definitionsByName[filterName];
      if (!definition) {
        return acc;
      }

      var filterValues = queryValuesToFilterValues(definition, queryParams[key]);

      if (filterValues && Array.isArray(filterValues) && filterValues.length) {
        return Object.assign(acc, _defineProperty({}, filterName, filterValues));
      }

      return acc;
    }, {});
  },
  toApiParams: function toApiParams(filters /* arrayOf({ name: string, values: array}) */) {
    var _this3 = this;

    return filters.reduce(function (acc, filter) {
      var definition = _this3.definitionsByName[filter.name];
      var apiParams = filterValuesToApiParams(definition, filter.values);

      if (!(0, _utils.isEmpty)(apiParams)) {
        return Object.assign(acc, apiParams);
      }

      return acc;
    }, {});
  },
  valueToTagLabel: function valueToTagLabel(filterName, value, props, store, t) {
    var definition = this.definitionsByName[filterName];
    if (!definition) {
      return value;
    }

    return definition.valueToTagLabel(value, props, store, t);
  },
  getTagIcon: function getTagIcon(filterName) {
    var definition = this.definitionsByName[filterName];
    if (!definition) {
      return '';
    }

    return definition.tagIcon;
  }
};

exports.default = filtersTransformer;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var _sources = require('../../redux/modules/sources');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sourcesFilter = {
  name: 'sources-filter',
  queryKey: 'source',
  valueToQuery: function valueToQuery(value) {
    return value.join('_');
  },
  queryToValue: function queryToValue(queryValue) {
    return queryValue.split('_');
  },
  valueToApiParam: function valueToApiParam(value) {
    return _defineProperty({}, value.length === 1 ? 'author' : 'source', value[value.length - 1]);
  },
  tagIcon: 'book',
  valueToTagLabel: function valueToTagLabel(value, props, _ref2) {
    var getState = _ref2.getState;

    if (!value) {
      return '';
    }

    var getSourceById = _sources.selectors.getSourceById(getState().sources);
    var path = value.map(function (x) {
      return getSourceById(x);
    });

    // Make sure we have all items.
    // Location hydration probably happens before we receive sources
    return path.some(function (x) {
      return !x;
    }) ? '' : path.map(function (x) {
      return x.name;
    }).join(' > ');
  }
};

exports.default = (0, _util.createFilterDefinition)(sourcesFilter);
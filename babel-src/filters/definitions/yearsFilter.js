'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var yearsFilter = {
  name: 'years-filter',
  queryKey: 'year',
  queryToValue: function queryToValue(value) {
    return parseInt(value, 10);
  },
  valueToApiParam: function valueToApiParam(value) {
    return { year: value };
  },
  tagIcon: 'calendar',
  valueToTagLabel: function valueToTagLabel(value) {
    return '' + value;
  }
};

exports.default = (0, _util.createFilterDefinition)(yearsFilter);
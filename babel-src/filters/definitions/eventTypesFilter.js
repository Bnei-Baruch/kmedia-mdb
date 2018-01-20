'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var _events = require('../../redux/modules/events');

var eventTypesFilter = {
  name: 'event-types-filter',
  queryKey: 'eventType',
  valueToQuery: function valueToQuery(value) {
    return value.join('|');
  },
  queryToValue: function queryToValue(queryValue) {
    return queryValue.split('|');
  },
  valueToApiParam: function valueToApiParam(value) {
    var result = {
      content_type: value[0]
    };

    if (value.length > 1) {
      result.value = value[value.length - 1];
    }

    return result;
  },
  tagIcon: 'book',
  valueToTagLabel: function valueToTagLabel(value, props, _ref) {
    var getState = _ref.getState;

    if (!value) {
      return '';
    }

    var tree = _events.selectors.getEventFilterTree(getState().events);
    var path = value.map(function (x) {
      return tree.byIds[x];
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

exports.default = (0, _util.createFilterDefinition)(eventTypesFilter);
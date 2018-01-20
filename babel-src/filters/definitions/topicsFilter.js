'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var _tags = require('../../redux/modules/tags');

var topicsFilter = {
  name: 'topics-filter',
  queryKey: 'topic',
  valueToApiParam: function valueToApiParam(value) {
    return { tag: value };
  },
  tagIcon: 'tag',
  valueToTagLabel: function valueToTagLabel(value, props, _ref) {
    var getState = _ref.getState;

    if (!value) {
      return '';
    }

    // Make sure we have the item.
    // Location hydration probably happens before we receive tags
    var tag = _tags.selectors.getTagById(getState().tags)(value);
    return tag && tag.label ? tag.label : '';
  }
};

exports.default = (0, _util.createFilterDefinition)(topicsFilter);
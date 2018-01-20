'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendDefinition = extendDefinition;
exports.createFilterDefinition = createFilterDefinition;

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitionPrototype = {
  valueToQuery: _identity2.default,
  queryToValue: _identity2.default,
  tagIcon: 'tag',
  valueToTagLabel: _identity2.default,
  valueToApiParam: function valueToApiParam() {
    return null;
  }
};

function extendDefinition(base, definition) {
  if (!definition.name) {
    throw new Error('filter must have a name');
  }

  var baseInstance = Object.create(base);
  var extendedDefinition = Object.assign(baseInstance, definition);

  if (!definition.queryKey) {
    extendedDefinition.queryKey = definition.name;
  }

  return extendedDefinition;
}

function createFilterDefinition(definition) {
  return extendDefinition(definitionPrototype, definition);
}
import identity from 'lodash/identity';

const definitionPrototype = {
  valueToQuery: identity,
  queryToValue: identity,
  valueToTagLabel: identity,
  valueToApiParam: () => null
};

export function extendDefinition(base, definition) {
  if (!definition.name) {
    throw new Error('filter must have a name');
  }

  const baseInstance = Object.create(base);
  const extendedDefinition = Object.assign(baseInstance, definition);

  if (!definition.queryKey) {
    extendedDefinition.queryKey = definition.name;
  }

  return extendedDefinition;
}

export function createFilterDefinition(definition) {
  return extendDefinition(definitionPrototype, definition);
}

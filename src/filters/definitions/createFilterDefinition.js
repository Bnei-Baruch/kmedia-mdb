import identity from 'lodash/identity';

const defaultFilterDefinition = {
  valueToQuery: identity,
  queryToValue: identity,
  tagIcon: 'tag',
  valueToTagLabel: identity,
  valueToApiParam: () => null
};

export default function createFilterDefinition(definition) {
  if (!definition.name) {
    throw new Error('filter must have a name');
  }

  const bareDefinition = Object.create(defaultFilterDefinition);
  const extendedDefinition = Object.assign(bareDefinition, definition);

  if (!extendedDefinition.queryKey) {
    extendedDefinition.queryKey = extendedDefinition.name;
  }

  return extendedDefinition;
}

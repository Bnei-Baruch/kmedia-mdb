const base = {
  valueToQuery: value => value,
  queryToValue: queryValue => queryValue,
  valueToTagLabel: value => value || '',
  valueToApiParam: (value, key) => ({ [key]: value }),
};

export function extendDefinition(base, definition) {
  if (!definition.name) {
    throw new Error('filter must have a name');
  }

  const baseInstance       = Object.create(base);
  const extendedDefinition = Object.assign(baseInstance, definition);

  if (!definition.queryKey) {
    extendedDefinition.queryKey = definition.name;
  }

  return extendedDefinition;
}

export function createFilterDefinition(definition) {
  return { ...base, ...definition };
}

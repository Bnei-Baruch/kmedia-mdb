import { definitionsByName } from './transformer';
import { isEmpty } from '../../src/helpers/utils';

export const updateFiltersSearchParams = (val, checked, fn, searchParams) => {
  const _params = new URLSearchParams(searchParams);
  const def     = definitionsByName[fn];
  const values  = _params.getAll(def.queryKey).filter(x => x !== val);
  if (checked) {
    values.push(val);
  }
  _params.delete(def.queryKey);
  values.forEach(x => _params.append(def.queryKey, x));
  return _params.toString();
};

export const toApiParams = (filters) => {
  return Object.entries(filters).reduce((acc, [name, values]) => {
    if (isEmpty(values)) {
      return acc;
    }
    const definition         = definitionsByName[name];
    acc[definition.queryKey] = values;
    return acc;
  }, {});
};

import { definitionsByName } from './transformer';
import { isEmpty } from '@/src/helpers/utils';

export const updateFiltersSearchParams = (val, checked, fn, searchParams, clear) => {
  const _params = new URLSearchParams(searchParams);
  const def     = definitionsByName[fn];
  const values  = clear ? [] : _params.getAll(def.queryKey).filter(x => x !== val);
  if (checked) {
    values.push(val);
  }
  _params.delete(def.queryKey);
  values.forEach(x => _params.append(def.queryKey, x));
  _params.delete('page_no');
  return _params.toString();
};

export const toApiParams = (filters) => {
  return Object.entries(filters).reduce((acc, [name, values]) => {
    if (isEmpty(values)) {
      return acc;
    }
    const definition         = definitionsByName[name];
    acc[definition.apiKey] = values;
    return acc;
  }, {});
};

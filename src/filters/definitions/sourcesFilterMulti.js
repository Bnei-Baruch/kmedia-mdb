import { createFilterDefinition } from './util';
import { selectors } from '../../../lib/redux/slices/sourcesSlice/sourcesSlice';
import { FN_SOURCES_MULTI } from '../../helpers/consts';

const sourcesFilterMulti = {
  name: FN_SOURCES_MULTI,
  queryKey: 'sources',
  valueToQuery: value => value,
  queryToValue: queryValue => queryValue,
  valueToApiParam: value => ({ [value.length < 8 ? 'author' : 'source']: value }),
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const getSourceById = selectors.getSourceById(getState().sources);
    const sources       = value.map(getSourceById);

    return sources.some(x => !x)
      ? ''
      : sources
        .map(x => x.name)
        .join('<span class="filter__separator"> , </span>');
  }
};

export default createFilterDefinition(sourcesFilterMulti);

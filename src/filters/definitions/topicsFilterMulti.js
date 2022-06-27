import { FN_TOPICS_MULTI } from '../../helpers/consts';
import { selectors } from '../../redux/modules/tags';
import { createFilterDefinition } from './util';

const topicsFilterMulti = {
  name: FN_TOPICS_MULTI,
  queryKey: 'topics',
  valueToQuery: value => value,
  queryToValue: queryValue => queryValue,
  valueToApiParam: value => ({ tag: value }),
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const getTagById = selectors.getTagById(getState().tags);
    const tags       = value.map(getTagById);
    // Make sure we have all items.
    // Location hydration probably happens before we receive sources
    return tags.some(x => !x)
      ? ''
      : tags
        .map(x => x.label)
        .join('<span class="filter__separator"> / </span>');
  }
};

export default createFilterDefinition(topicsFilterMulti);

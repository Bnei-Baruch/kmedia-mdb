import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import { createFilterDefinition } from './util';

const collectionsFilter = {
  name: 'collections-filter',
  queryKey: 'collection',
  valueToQuery: value => value.join('|'),
  queryToValue: queryValue => queryValue.split('|'),
  valueToApiParam: value => ({ collection: value[0] }),
  valueToTagLabel: (value, props, store) => {
    if (!value) {
      return '';
    }

    const collection = mdbSelectors.getCollectionById(store.getState().mdb, value);
    return collection ? collection.name : value;
  }
};

export default createFilterDefinition(collectionsFilter);

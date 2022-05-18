import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import { createFilterDefinition } from './util';
import {  FN_COLLECTION_MULTI } from '../../helpers/consts';

const collectionsFilterMulti = {
  name: FN_COLLECTION_MULTI,
  queryKey: 'collection',
  valueToQuery: value => value,
  queryToValue: queryValue => queryValue,
  valueToApiParam: value => ({ collection: value }),
  valueToTagLabel: (value, props, store) => {
    if (!value) {
      return '';
    }

    const collection = mdbSelectors.getCollectionById(store.getState().mdb, value);
    return collection ? `<span class="filter__breadcrumb">${collection.name}</span>` : value;
  }
};

export default createFilterDefinition(collectionsFilterMulti);

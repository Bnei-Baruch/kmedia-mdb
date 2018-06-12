import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import { createFilterDefinition } from './util';

const collectionsFilter = {
  name: 'collections-filter',
  queryKey: 'collection',
  valueToApiParam: value => ({ collection: value }),
  valueToTagLabel: (value, props, store) => {
    if (!value) {
      return '';
    }

    const collection = mdbSelectors.getCollectionById(store.getState().mdb, value);
    return collection ? collection.name : value;
  }
};

export default createFilterDefinition(collectionsFilter);

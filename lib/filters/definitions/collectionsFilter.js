import { selectors as mdbSelectors, selectors as mdb } from '../../redux/slices/mdbSlice/mdbSlice';
import { createFilterDefinition } from './util';
import { FN_COLLECTION_MULTI } from '../../../src/helpers/consts';
import { useSelector } from 'react-redux';

const Label = ({ value }) => {
  const collection = useSelector(state => mdb.getCollectionById(state.mdb, value));

  if (!collection) return value || '';

  return (
    <span className="filter__breadcrumb">
      {collection.name}
    </span>
  );
};

const collectionsFilter = {
  name: FN_COLLECTION_MULTI,
  queryKey: 'collection',
  apiKey: 'collection',
  valueToQuery: value => value.join('|'),
  queryToValue: queryValue => queryValue.split('|'),
  valueToTagLabel: Label
};

export default createFilterDefinition(collectionsFilter);

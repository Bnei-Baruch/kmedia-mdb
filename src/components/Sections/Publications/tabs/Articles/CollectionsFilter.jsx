import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CT_ARTICLES, FN_COLLECTION_MULTI } from '../../../../../helpers/consts';
import { actions } from '../../../../../redux/modules/filtersAside';
import {
  mdbGetCollectionsByCt,
  mdbNestedGetCollectionByIdSelector,
} from '../../../../../redux/selectors';
import FilterHeader from '../../../../FiltersAside/FilterHeader';
import CollectionItem from '../../../../FiltersAside/CollectionFilter/CollectionItem';

const CollectionsFilter = ({ namespace }) => {
  const getById  = useSelector(mdbNestedGetCollectionByIdSelector);
  const ids      = useSelector(state => mdbGetCollectionsByCt(state, CT_ARTICLES));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.collectionsByCt({ namespace, content_type: CT_ARTICLES }));
  }, [dispatch, namespace]);

  const collections = useMemo(() =>
    ids.map(getById)
      .filter(Boolean)
      .sort((a, b) => (a.name === b.name ? 0 : a.name > b.name ? 1 : -1)),
  [ids, getById]);

  if (collections.length === 0) return null;

  return (
    <FilterHeader
      filterName={FN_COLLECTION_MULTI}
      children={collections.map(item => (
        <CollectionItem key={item.id} namespace={namespace} item={item} />
      ))}
    />
  );
};

export default CollectionsFilter;

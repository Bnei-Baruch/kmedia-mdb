import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { FN_COLLECTION_MULTI, FN_CONTENT_TYPE } from '../../../../src/helpers/consts';
import { filterSlice, selectors as filters } from '../../../redux/slices/filterSlice/filterSlice';
import { selectors as filtersAside } from '../../../redux/slices/filterSlice/filterStatsSlice';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { updateFiltersSearchParams } from '../../helper';

const CollectionItem = ({ namespace, item: { id, name } }) => {
  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_COLLECTION_MULTI)) || [];
  const stat     = useSelector(state => filtersAside.getStats(state.filterStats, namespace, FN_COLLECTION_MULTI)(id));

  const searchParams = useSearchParams();
  const router       = useRouter();
  const handleSelect = (e, { checked }) => {
    const query = updateFiltersSearchParams(id, checked, FN_COLLECTION_MULTI, searchParams);
    router.push({ query });
  };
/*

  const dispatch     = useDispatch();
  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(filterSlice.actions.setFilterValues({ namespace, name: FN_COLLECTION_MULTI, values: val }));
  };
*/

  return (<List.Item key={FN_COLLECTION_MULTI} disabled={stat === 0}>
    <List.Content className="tree_item_content">
      <Checkbox
        checked={!!selected.find(x => x === id)}
        onChange={handleSelect}
        disabled={stat === 0}
      />
      <span className="tree_item_title">
        {name}
      </span>
      <span className="stat">{`(${stat})`}</span>
    </List.Content>
  </List.Item>);
};

export default CollectionItem;

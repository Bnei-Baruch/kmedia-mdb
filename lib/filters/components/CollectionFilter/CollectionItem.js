import React from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { FN_COLLECTION_MULTI } from '../../../../src/helpers/consts';
import { selectors as filters } from '../../../redux/slices/filterSlice/filterSlice';
import { selectors as filterStats } from '../../../redux/slices/filterSlice/filterStatsSlice';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { updateFiltersSearchParams } from '../../helper';

const CollectionItem = ({ namespace, item: { id, name } }) => {
  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_COLLECTION_MULTI)) || [];
  const stat     = useSelector(state => filterStats.getStats(state.filterStats, namespace, FN_COLLECTION_MULTI)(id));

  const searchParams = useSearchParams();
  const router       = useRouter();
  const handleSelect = (e, { checked }) => {
    const query = updateFiltersSearchParams(id, checked, FN_COLLECTION_MULTI, searchParams);
    router.push({ query }, undefined, { scroll: false });
  };

  return (
    <List.Item key={FN_COLLECTION_MULTI} disabled={stat === 0}>
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

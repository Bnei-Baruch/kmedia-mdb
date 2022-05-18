import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { FN_COLLECTION_MULTI } from '../../../helpers/consts';
import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';

const CollectionItem = ({ namespace, item: { id, name } }) => {

  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_COLLECTION_MULTI))?.values || [];
  const stat     = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_COLLECTION_MULTI)(id));

  const dispatch     = useDispatch();
  const handleSelect = (e, { checked }) => {
    let val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_COLLECTION_MULTI, val));
  };

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

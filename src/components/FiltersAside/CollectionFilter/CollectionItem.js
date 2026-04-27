import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FN_COLLECTION_MULTI } from '../../../helpers/consts';
import { actions } from '../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const CollectionItem = ({ namespace, item: { id, name } }) => {

  const selected = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_COLLECTION_MULTI))?.values || [];
  const stat     = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_COLLECTION_MULTI))(id);

  const dispatch     = useDispatch();
  const handleSelect = e => {
    const val = [...selected].filter(x => x !== id);
    if (e.target.checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_COLLECTION_MULTI, val));
  };

  return (
    <div className={stat === 0 ? 'opacity-50 pointer-events-none' : ''}>
      <div className="tree_item_content">
        <input
          type="checkbox"
          checked={!!selected.find(x => x === id)}
          onChange={handleSelect}
          disabled={stat === 0}
        />
        <span className="tree_item_title">
          {name}
        </span>
        <span className="stat">{`(${stat})`}</span>
      </div>
    </div>
  );
};

export default CollectionItem;

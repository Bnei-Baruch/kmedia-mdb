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
    <div className={`filters-aside-ct filters-aside-ct--normal ${stat === 0 ? 'filter-item-disabled' : ''}`}>
      <div className="filters-aside-ct__group">
        <label className="filters-aside-ct__label">
          <input
            type="checkbox"
            checked={!!selected.find(x => x === id)}
            onChange={handleSelect}
            disabled={stat === 0}
          />
          <span className="tree_item_title">{name}</span>
        </label>
      </div>
      <span className="stat">{`(${stat})`}</span>
    </div>
  );
};

export default CollectionItem;

import { useDispatch, useSelector } from 'react-redux';

import { FN_COLLECTION_MULTI, FN_PART_OF_DAY } from '../../../../helpers/consts';
import { actions } from '../../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersGetFilterByNameSelector } from '../../../../redux/selectors';
import { useTranslation } from 'react-i18next';

const PartOfDayItem = ({ namespace, dayPart }) => {
  const stat     = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_PART_OF_DAY))(dayPart);
  const selected = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_PART_OF_DAY))?.values || [];

  const { t }        = useTranslation();
  const dispatch     = useDispatch();
  const handleSelect = e => {
    const { checked } = e.target;
    const val         = [...selected].filter(x => x !== dayPart);
    if (checked) {
      val.push(dayPart);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_PART_OF_DAY, val));
  };

  return (
    <div key={FN_COLLECTION_MULTI} className={`filters-aside-ct filters-aside-ct--normal ${stat === 0 ? 'filter-item-disabled' : ''}`}>
      <div className="filters-aside-ct__group">
        <label className="filters-aside-ct__label">
          <input
            type="checkbox"
            checked={!!selected?.find(x => x === dayPart)}
            onChange={handleSelect}
            disabled={stat === 0}
          />
          <span className="tree_item_title">{t(`lessons.list.nameByNum_${dayPart}`)}</span>
        </label>
      </div>
      <span className="stat">{`(${stat})`}</span>
    </div>
  );
};

export default PartOfDayItem;

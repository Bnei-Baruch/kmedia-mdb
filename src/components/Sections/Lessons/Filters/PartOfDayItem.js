import React from 'react';
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
    <li key={FN_COLLECTION_MULTI} className={stat === 0 ? 'opacity-50 pointer-events-none' : ''}>
      <div className="tree_item_content">
        <input
          type="checkbox"
          checked={!!selected?.find(x => x === dayPart)}
          onChange={handleSelect}
          disabled={stat === 0}
        />
        <span className="tree_item_title">{t(`lessons.list.nameByNum_${dayPart}`)}</span>
        <span className="stat">{`(${stat})`}</span>
      </div>
    </li>
  );
};

export default PartOfDayItem;

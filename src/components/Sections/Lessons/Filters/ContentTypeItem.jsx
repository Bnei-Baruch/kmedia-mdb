import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { CT_LESSONS, FN_CONTENT_TYPE } from '../../../../helpers/consts';
import { actions } from '../../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersGetFilterByNameSelector } from '../../../../redux/selectors';

const ContentTypeItem = ({ namespace, id, isSelChild = false }) => {
  const { t } = useTranslation();
  const isLesson = CT_LESSONS.includes(id);
  const selected = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE))?.values || [];
  const stat     = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE))(id);

  const dispatch = useDispatch();

  const handleSelect = e => {
    const { checked } = e.target;
    const val = [...selected].filter(x => x !== id).filter(x => !isLesson || !CT_LESSONS.includes(x));
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_CONTENT_TYPE, val));
  };

  const isSel = isLesson ? selected.some(id => CT_LESSONS.includes(id)) : selected.includes(id);

  return (
    <div key={`${FN_CONTENT_TYPE}_${id}`} className={`filters-aside-ct${stat === 0 ? ' opacity-50 pointer-events-none' : ''}`}>
      <div className="filters-aside-ct__group">
        <label className="filters-aside-ct__label">
          <input
            type="checkbox"
            ref={el => {
              if (el) el.indeterminate = isSelChild;
            }}
            checked={isSel}
            onChange={handleSelect}
            disabled={stat === 0}
          />
          {t(`filters.content-types.${id}`)}
        </label>
      </div>
      <span className="stat">{`(${stat})`}</span>
    </div>
  );
};

export default ContentTypeItem;

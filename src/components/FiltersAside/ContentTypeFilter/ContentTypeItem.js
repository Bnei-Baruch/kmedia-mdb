import React, { useEffect, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { FN_CONTENT_TYPE } from '../../../helpers/consts';
import { actions } from '../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const ContentTypeItem = ({ namespace, id, isSelChild = false, t }) => {
  const selected = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE))?.values || [];
  const stat     = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE))(id);

  const dispatch    = useDispatch();
  const checkboxRef = useRef(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isSelChild;
    }
  }, [isSelChild]);

  const handleSelect = e => {
    const val = [...selected].filter(x => x !== id);
    if (e.target.checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_CONTENT_TYPE, val));
  };

  return (
    <div className={`filters-aside-ct flex items-center justify-between ${stat === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
      <label className="flex items-center justify-between no-wrap gap-2">
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={selected.includes(id)}
          onChange={handleSelect}
          disabled={stat === 0}
        />
        {t(`filters.content-types.${id}`)}
      </label>
      <span className="stat">
        {`(${stat})`}
      </span>
    </div>
  );
};

export default withTranslation()(ContentTypeItem);

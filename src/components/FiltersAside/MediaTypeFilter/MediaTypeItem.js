import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FN_MEDIA_TYPE } from '../../../helpers/consts';

import { actions } from '../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const MediaTypeItem = ({ namespace, id }) => {
  const { t } = useTranslation();
  const selectedFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_MEDIA_TYPE));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);
  const stat            = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_MEDIA_TYPE))(id);

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_MEDIA_TYPE, val));
  };

  return (
    <div className={stat === 0 ? 'opacity-50 pointer-events-none' : ''}>
      <span className="stat float-right">
        {`(${stat})`}
      </span>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selected.includes(id)}
          onChange={e => handleSelect(e, { checked: e.target.checked })}
          disabled={stat === 0}
        />
        {t(`filters.media-types.${id}`)}
      </label>
    </div>
  );
};

export default MediaTypeItem;

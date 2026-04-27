import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FN_ORIGINAL_LANGUAGES, LANGUAGES } from '../../../helpers/consts';

import { actions } from '../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const OriginalLanguageItem = ({ namespace, id }) => {
  const selectedFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_ORIGINAL_LANGUAGES));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);
  const stat            = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_ORIGINAL_LANGUAGES))(id);

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_ORIGINAL_LANGUAGES, val));
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
        {LANGUAGES[id]?.name}
      </label>
    </div>
  );
};

export default OriginalLanguageItem;

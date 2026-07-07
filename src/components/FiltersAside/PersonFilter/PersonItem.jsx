import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FN_PERSON } from '../../../helpers/consts';
import { actions } from '../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersGetFilterByNameSelector, mdbGetPersonByIdSelector } from '../../../redux/selectors';

const PersonItem = ({ namespace, id }) => {
  const selectedFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_PERSON));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);

  const stat   = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_PERSON)(id));
  const person = useSelector(mdbGetPersonByIdSelector)(id);

  const dispatch     = useDispatch();
  const handleSelect = e => {
    const val = [...selected].filter(x => x !== id);
    if (e.target.checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_PERSON, val));
  };

  return (
    <div key={`${FN_PERSON}_${id}`} className={`filters-aside-ct${stat === 0 ? ' opacity-50 pointer-events-none' : ''}`}>
      <div className="filters-aside-ct__group">
        <label className="filters-aside-ct__label">
          <input
            type="checkbox"
            checked={selected.includes(id)}
            onChange={handleSelect}
            disabled={stat === 0}
          />
          {person?.name}
        </label>
      </div>
      <span className="stat">{`(${stat})`}</span>
    </div>
  );
};

export default PersonItem;

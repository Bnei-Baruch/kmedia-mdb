import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FN_LOCATIONS } from '../../../helpers/consts';

import { actions } from '../../../redux/modules/filters';
import {
  filtersAsideCitiesByCountrySelector,
  filtersAsideGetStatsSelector,
  filtersGetFilterByNameSelector,
  settingsGetLeftRightByDirSelector
} from '../../../redux/selectors';
import CitiesModal from './CitiesModal';

const CountryItem = ({ namespace, loc }) => {

  const { id, desc } = loc;

  const [open, setOpen] = useState(false);

  const selectedFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_LOCATIONS));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);
  const cities          = useSelector(state => filtersAsideCitiesByCountrySelector(state, namespace))(id);
  const getStat         = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_LOCATIONS));
  const stat            = getStat(id);

  const leftRight   = useSelector(settingsGetLeftRightByDirSelector);
  const dispatch    = useDispatch();
  const checkboxRef = useRef(null);

  const isIndeterminate = !selected.includes(id) && selected.some(x => cities.includes(x));

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id && !cities.includes(x));
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_LOCATIONS, val));
  };

  const toggleOpen = () => setOpen(!open);

  const arrowIcon = leftRight === 'right' ? 'arrow_right' : 'arrow_left';

  return (
    <>
      <div key={id} className={`filters-aside-ct filters-aside-ct--normal ${stat === 0 ? 'filter-item-disabled' : ''}`}>
        <div className="filters-aside-ct__group">
          <label className="filters-aside-ct__label">
            <input
              ref={checkboxRef}
              type="checkbox"
              checked={selected.includes(id)}
              onChange={e => handleSelect(e, { checked: e.target.checked })}
              disabled={stat === 0}
            />
            <span className="tree_item_title">{desc}</span>
          </label>
          <span className="filters-aside-ct__caret material-symbols-outlined text-blue-600" onClick={toggleOpen}>
            {arrowIcon}
          </span>
        </div>
        <span className="stat">{`(${stat})`}</span>
      </div>
      <CitiesModal namespace={namespace} open={open} country={id} onClose={() => setOpen(false)} />
    </>
  );
};

export default CountryItem;

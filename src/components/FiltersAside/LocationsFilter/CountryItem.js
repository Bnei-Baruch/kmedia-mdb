import React, { useEffect, useMemo, useRef, useState } from 'react';
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
      <div key={id} className={`pt-1/2 ${stat === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-baseline gap-2 w-full">
          <input
            ref={checkboxRef}
            type="checkbox"
            className="shrink-0"
            checked={selected.includes(id)}
            onChange={e => handleSelect(e, { checked: e.target.checked })}
            disabled={stat === 0}
          />
          <div className="flex items-start gap-1 flex-1">
            <span className="tree_item_title">
              {desc}
            </span>
            <span
              className="material-symbols-outlined text-blue-600 cursor-pointer text-2xl shrink-0 leading-none"
              onClick={toggleOpen}
            >
              {arrowIcon}
            </span>
          </div>
          <span className="stat">{`(${stat})`}</span>
        </div>
      </div>
      <CitiesModal namespace={namespace} open={open} country={id} onClose={() => setOpen(false)} />
    </>
  );
};

export default CountryItem;

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FN_LOCATIONS } from '../../../helpers/consts';

import { actions } from '../../../redux/modules/filters';
import { getTitle } from './helper';
import { filtersAsideCitiesByCountrySelector, filtersAsideGetStatsSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const CityItem = ({ namespace, id, country }) => {
  const { t } = useTranslation();
  const selectedFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_LOCATIONS));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);
  const stat            = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_LOCATIONS))(id);
  const dispatch        = useDispatch();
  const cities          = useSelector(state => filtersAsideCitiesByCountrySelector(state, namespace))(country);

  const handleSelect = (e, { checked }) => {
    let val                = [...selected].filter(x => x !== id && x !== country);
    const selCountryCities = val.filter(x => cities.includes(x));

    if (checked && selCountryCities.length + 1 < cities.length) {
      val.push(id);
    } else if (checked) {
      val = val.filter(x => cities.includes(x));
      val.push(country);
    } else if (selected.includes(country)) {
      val = [...val, ...cities.filter(x => x !== id)];
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_LOCATIONS, val));
  };

  return (
    <div key={getTitle(id, t)} className={stat === 0 ? 'opacity-50 pointer-events-none' : ''}>
      <div className="flex items-baseline gap-2 w-full">
        <input
          type="checkbox"
          checked={!!selected.find(x => x === id || x === country)}
          onChange={e => handleSelect(e, { checked: e.target.checked })}
          disabled={stat === 0}
        />
        <span className="tree_item_title flex-1">
          {getTitle(id, t)}
        </span>
        <span className="stat">{`(${stat})`}</span>
      </div>
    </div>
  );
};

export default CityItem;

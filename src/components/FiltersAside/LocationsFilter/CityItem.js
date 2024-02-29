import React, { useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';
import { FN_LOCATIONS } from '../../../helpers/consts';

import { actions } from '../../../redux/modules/filters';
import { getTitle } from './helper';
import { filtersAsideCitiesByCountrySelector, filtersAsideGetStatsSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const CityItem = ({ namespace, id, country, t }) => {
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
    <List.Item key={getTitle(id, t)} disabled={stat === 0}>
      <List.Content className="tree_item_content">
        <Checkbox
          checked={!!selected.find(x => x === id || x === country)}
          onChange={handleSelect}
          disabled={stat === 0}
        />
        <span className="tree_item_title">
          {getTitle(id, t)}
        </span>
        <span className="stat">{`(${stat})`}</span>
      </List.Content>
    </List.Item>
  );
};

export default withTranslation()(CityItem);

import React, { useMemo } from 'react';
import { withTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';
import { FN_LOCATIONS } from '../../../../src/helpers/consts';

import { filterSlice, selectors as filters } from '../../../redux/slices/filterSlice/filterSlice';
import { selectors as filtersAside } from '../../../redux/slices/filterSlice/filterStatsSlice';
import { getTitle } from './helper';

const CityItem = ({ namespace, id, county, t }) => {
  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_LOCATIONS));
  const selected        = useMemo(() => selectedFilters || [], [selectedFilters]);
  const stat            = useSelector(state => filtersAside.getStats(state.filterStats, namespace, FN_LOCATIONS)(id));
  const dispatch        = useDispatch();
  const cities          = useSelector(state => filtersAside.citiesByCountry(state.filterStats, namespace)(county));

  const handleSelect = (e, { checked }) => {
    let values             = [...selected].filter(x => x !== id && x !== county);
    const selCountryCities = values.filter(x => cities.includes(x));

    if (checked && selCountryCities.length + 1 < cities.length) {
      values.push(id);
    } else if (checked) {
      values = values.filter(x => cities.includes(x));
      values.push(county);
    } else if (selected.includes(county)) {
      values = [...values, ...cities.filter(x => x !== id)];
    }

    dispatch(filterSlice.actions.setFilterValues({ namespace, name: FN_LOCATIONS, values }));
  };

  return (
    <List.Item key={getTitle(id, t)} disabled={stat === 0}>
      <List.Content className="tree_item_content">
        <Checkbox
          checked={!!selected.find(x => x === id || x === county)}
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

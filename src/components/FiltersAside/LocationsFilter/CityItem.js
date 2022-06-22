import React, { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';
import { FN_LOCATIONS } from '../../../helpers/consts';

import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';
import { getTitle } from './helper';

const CityItem = ({ namespace, id, county, t }) => {
  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_LOCATIONS));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);
  const stat            = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_LOCATIONS)(id));
  const dispatch        = useDispatch();
  const cities          = useSelector(state => filtersAside.citiesByCountry(state.filtersAside, namespace)(county));

  const handleSelect = (e, { checked }) => {
    let val                = [...selected].filter(x => x !== id && x !== county);
    const selCountryCities = val.filter(x => cities.includes(x));

    if (checked && selCountryCities.length + 1 < cities.length) {
      val.push(id);
    } else if (checked) {
      val = val.filter(x => cities.includes(x));
      val.push(county);
    } else if (selected.includes(county)) {
      val = [...val, ...cities.filter(x => x !== id)];
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_LOCATIONS, val));
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

export default withNamespaces()(CityItem);

import React, { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';
import { FN_LOCATIONS } from '../../../helpers/consts';

import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';
import { getTitle } from './helper';

const CountryItem = ({ namespace, id, t }) => {
  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_LOCATIONS));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);
  const stat            = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_LOCATIONS)(id));

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_LOCATIONS, val));
  };

  return (
    <List.Item key={getTitle(id, t)} disabled={stat === 0}>
      <List.Content className="tree_item_content">
        <Checkbox
          checked={selected.find(x => x.cities.includes(id))}
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

export default withNamespaces()(CountryItem);

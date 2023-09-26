import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { FN_PERSON } from '../../../../src/helpers/consts';
import { filterSlice, selectors as filters } from '../../../redux/slices/filterSlice/filterSlice';
import { selectors as filtersAside } from '../../../redux/slices/filterSlice/filterStatsSlice';
import { selectors as mdb } from '../../../redux/slices/mdbSlice/mdbSlice';

const PersonItem = ({ namespace, id }) => {
  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_PERSON));
  const selected        = useMemo(() => selectedFilters || [], [selectedFilters]);

  const stat   = useSelector(state => filtersAside.getStats(state.filterStats, namespace, FN_PERSON)(id));
  const person = useSelector(state => mdb.getPersonById(state.mdb)(id));

  const dispatch     = useDispatch();
  const handleSelect = (e, { checked }) => {
    const values = [...selected].filter(x => x !== id);
    if (checked) {
      values.push(id);
    }

    dispatch(filterSlice.actions.setFilterValues({ namespace, name: FN_PERSON, values }));
  };

  return (
    <List.Item key={`${FN_PERSON}_${id}`} disabled={stat === 0} className="filters-aside-ct">
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={person?.name}
        checked={selected.includes(id)}
        onChange={handleSelect}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default PersonItem;

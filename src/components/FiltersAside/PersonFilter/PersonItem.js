import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { FN_PERSON } from '../../../helpers/consts';
import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';
import { selectors as mdb } from '../../../redux/modules/mdb';

const PersonItem = ({ namespace, id }) => {
  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_PERSON));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);

  const stat     = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_PERSON)(id));
  const { name } = useSelector(state => mdb.getPersonById(state.mdb)(id));

  const dispatch     = useDispatch();
  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_PERSON, val));
  };

  return (
    <List.Item key={`${FN_PERSON}_${id}`} disabled={stat === 0} className="filters-aside-ct">
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={name}
        checked={selected.includes(id)}
        onChange={handleSelect}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default PersonItem;
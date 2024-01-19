import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { FN_PERSON } from '../../../helpers/consts';
import { actions } from '../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersGetFilterByNameSelector, mdbGetPersonByIdSelector } from '../../../redux/selectors';

const PersonItem = ({ namespace, id }) => {
  const selectedFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_PERSON));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);

  const stat   = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_PERSON)(id));
  const person = useSelector(mdbGetPersonByIdSelector)(id);

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
        label={person?.name}
        checked={selected.includes(id)}
        onChange={handleSelect}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default PersonItem;

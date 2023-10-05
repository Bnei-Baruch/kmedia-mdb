import React from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { FN_PERSON, FN_CONTENT_TYPE, CT_LESSONS } from '../../../../src/helpers/consts';
import { selectors as filters } from '../../../redux/slices/filterSlice/filterSlice';
import { selectors as filterStats } from '../../../redux/slices/filterSlice/filterStatsSlice';
import { selectors as mdb } from '../../../redux/slices/mdbSlice/mdbSlice';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { updateFiltersSearchParams } from '../../helper';
import { definitionsByName } from '../../transformer';

const PersonItem = ({ namespace, id }) => {
  const filterName = FN_PERSON;

  const stat   = useSelector(state => filterStats.getStats(state.filterStats, namespace, filterName)(id));
  const person = useSelector(state => mdb.getPersonById(state.mdb)(id));

  const searchParams = useSearchParams();
  const router       = useRouter();

  const handleSelect = (e, { checked }) => {
    const query = updateFiltersSearchParams(id, checked, filterName, searchParams);
    router.push({ query }, undefined, { scroll: false });
  };

  const selected = searchParams.getAll(definitionsByName[filterName].queryKey);

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

import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { filterSlice, selectors as filters } from '../../../redux/slices/filterSlice/filterSlice';
import {
  selectors as filtersAside,
  selectors as filterStats
} from '../../../redux/slices/filterSlice/filterStatsSlice';
import { FN_LANGUAGES, LANGUAGES, FN_PERSON } from '../../../../src/helpers/consts';
import { selectors as mdb } from '../../../redux/slices/mdbSlice';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { updateFiltersSearchParams } from '../../helper';
import { definitionsByName } from '../../transformer';

const LanguageItem = ({ namespace, id }) => {
  const filterName = FN_LANGUAGES;

  const stat = useSelector(state => filterStats.getStats(state.filterStats, namespace, filterName)(id));

  const searchParams = useSearchParams();
  const router       = useRouter();

  const handleSelect = (e, { checked }) => {
    const query = updateFiltersSearchParams(id, checked, filterName, searchParams);
    router.push({ query }, undefined, { scroll: false });
  };

  const selected = searchParams.getAll(definitionsByName[filterName].queryKey);

  return (
    <List.Item disabled={stat === 0}>
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={LANGUAGES[id]?.name}
        checked={selected.includes(id)}
        onChange={handleSelect}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default LanguageItem;

import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';
import { FN_ORIGINAL_LANGUAGES, LANGUAGES } from '../../../../src/helpers/consts';

import { filterSlice, selectors as filters } from '../../../redux/slices/filterSlice/filterSlice';
import { selectors as filtersAside } from '../../../redux/slices/filterSlice/filterStatsSlice';

const OriginalLanguageItem = ({ namespace, id }) => {
  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_ORIGINAL_LANGUAGES));
  const selected        = useMemo(() => selectedFilters || [], [selectedFilters]);
  const stat            = useSelector(state => filtersAside.getStats(state.filterStats, namespace, FN_ORIGINAL_LANGUAGES)(id));

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const values = [...selected].filter(x => x !== id);
    if (checked) {
      values.push(id);
    }

    dispatch(filterSlice.actions.setFilterValues({ namespace, name: FN_ORIGINAL_LANGUAGES, values }));
  };

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

export default OriginalLanguageItem;

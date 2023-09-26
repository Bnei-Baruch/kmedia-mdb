import { useMemo } from 'react';
import { withTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';
import { FN_MEDIA_TYPE } from '../../../../src/helpers/consts';

import { filterSlice, selectors as filters } from '../../../redux/slices/filterSlice/filterSlice';
import { selectors as filtersAside } from '../../../redux/slices/filterSlice/filterStatsSlice';

const MediaTypeItem = ({ namespace, id, t }) => {
  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_MEDIA_TYPE));
  const selected        = useMemo(() => selectedFilters || [], [selectedFilters]);
  const stat            = useSelector(state => filtersAside.getStats(state.filterStats, namespace, FN_MEDIA_TYPE)(id));

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const values = [...selected].filter(x => x !== id);
    if (checked) {
      values.push(id);
    }

    dispatch(filterSlice.actions.setFilterValues({ namespace, name: FN_MEDIA_TYPE, values }));
  };

  return (
    <List.Item disabled={stat === 0}>
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={t(`filters.media-types.${id}`)}
        checked={selected.includes(id)}
        onChange={handleSelect}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default withTranslation()(MediaTypeItem);

import React from 'react';
import { withTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { FN_CONTENT_TYPE } from '../../../../src/helpers/consts';
import { filterSlice, selectors as filters } from '../../../redux/slices/filterSlice/filterSlice';
import { selectors as filtersAside } from '../../../redux/slices/filterSlice/filterStatsSlice';

const ContentTypeItem = ({ namespace, id, isSelChild = false, t }) => {
  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_CONTENT_TYPE) || []);
  const stat     = useSelector(state => filtersAside.getStats(state.filterStats, namespace, FN_CONTENT_TYPE)(id));

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(filterSlice.actions.setFilterValues({ namespace, name: FN_CONTENT_TYPE, values: val }));
  };

  return (
    <List.Item key={`${FN_CONTENT_TYPE}_${id}`} disabled={stat === 0} className="filters-aside-ct">
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={t(`filters.content-types.${id}`)}
        checked={selected.includes(id)}
        onChange={handleSelect}
        indeterminate={isSelChild}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default withTranslation()(ContentTypeItem);

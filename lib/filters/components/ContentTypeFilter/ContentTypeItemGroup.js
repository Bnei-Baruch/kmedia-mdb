import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors as filtersAside } from '../../../redux/slices/filterSlice/filterStatsSlice';
import { withTranslation } from 'next-i18next';
import { FN_CONTENT_TYPE } from '../../../../src/helpers/consts';
import ContentTypeItem from './ContentTypeItem';
import { Checkbox, List } from 'semantic-ui-react';
import { filterSlice, selectors as filters } from '../../../redux/slices/filterSlice/filterSlice';

const ContentTypeItemGroup = ({ namespace, group, t }) => {
  const { cts, key } = group;

  const selectedItems = useSelector(state => filtersAside.getTree(state.filterStats, namespace, FN_CONTENT_TYPE));
  const items         = selectedItems.filter(ct => cts.includes(ct));

  let selected    = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_CONTENT_TYPE) || []);
  selected        = selected.filter(ct => cts.includes(ct));
  const statsById = useSelector(state => filtersAside.getStats(state.filterStats, namespace, FN_CONTENT_TYPE));
  const stats     = cts.reduce((acc, x) => acc + statsById(x), 0);

  const dispatch = useDispatch();

  if (!(items?.length > 0))
    return null;

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => !cts.includes(x));
    if (checked) {
      val.push(...cts.filter(ct => items.includes(ct)));
    }

    dispatch(filterSlice.actions.setFilterValues({ namespace, name: FN_CONTENT_TYPE, values: val }));
  };

  const isSelAll = cts.filter(ct => items.includes(ct)).length === selected.length;

  return (
    <>
      {
        items.length > 0 && (
          <List.Item key={key} className="filters-aside-ct">
            <List.Content className="bold-font">
              <Checkbox
                label={t(`nav.sidebar.${key}`)}
                checked={isSelAll}
                onChange={handleSelect}
                disabled={stats === 0}
                indeterminate={selected.length > 0 && !isSelAll}
                value="lessons"
              />
            </List.Content>
            <List>
              {items.map(id => <ContentTypeItem namespace={namespace} id={id} key={id} />)}
            </List>
          </List.Item>
        )
      }
    </>
  );
};

export default withTranslation()(ContentTypeItemGroup);

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { FN_CONTENT_TYPE } from '../../../helpers/consts';
import ContentTypeItem from './ContentTypeItem';
import { Checkbox, List } from 'semantic-ui-react';
import { actions } from '../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersAsideGetTreeSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const ContentTypeItemGroup = ({ namespace, group, t }) => {
  const { cts, key } = group;

  const selectedItems = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_CONTENT_TYPE));
  const items         = cts.filter(ct => selectedItems.includes(ct));

  let selected    = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE))?.values || [];
  selected        = selected.filter(ct => cts.includes(ct));
  const statsById = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE));
  const stats     = cts.reduce((acc, x) => acc + statsById(x), 0);

  const dispatch = useDispatch();

  if (!(items?.length > 0))
    return null;

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => !cts.includes(x));
    if (checked) {
      val.push(...cts.filter(ct => items.includes(ct)));
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_CONTENT_TYPE, val));
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
              {items.map(id => <ContentTypeItem namespace={namespace} id={id} key={id}/>)}
            </List>
          </List.Item>
        )
      }
    </>
  );
};

export default withTranslation()(ContentTypeItemGroup);

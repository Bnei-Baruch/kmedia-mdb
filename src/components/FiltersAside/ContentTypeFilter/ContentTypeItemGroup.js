import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors as filtersAside, selectors } from '../../../redux/modules/filtersAside';
import { withNamespaces } from 'react-i18next';
import { FN_CONTENT_TYPE } from '../../../helpers/consts';
import ContentTypeItem from './ContentTypeItem';
import { Checkbox, List } from 'semantic-ui-react';
import { actions, selectors as filters } from '../../../redux/modules/filters';

const ContentTypeItemGroup = ({ namespace, group, t }) => {

  const { cts, key } = group;

  let items = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_CONTENT_TYPE));
  items     = items.filter(ct => cts.includes(ct));

  let selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_CONTENT_TYPE))?.values || [];
  selected     = selected.filter(ct => cts.includes(ct));

  const stats = useSelector(state => cts.reduce(
    (acc, x) => acc + filtersAside.getStats(state.filtersAside, namespace, FN_CONTENT_TYPE, x), 0)
  );

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
              {items.map(id => <ContentTypeItem namespace={namespace} id={id} key={id} />)}
            </List>
          </List.Item>
        )
      }
    </>
  );
};

export default withNamespaces()(ContentTypeItemGroup);

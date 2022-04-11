import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';
import { FN_CONTENT_TYPE } from '../../../helpers/consts';
import { withNamespaces } from 'react-i18next';

const ContentTypeItem = ({ namespace, id, t }) => {

  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_CONTENT_TYPE))?.values || [];
  const stat     = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_CONTENT_TYPE, id));

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_CONTENT_TYPE, val));
  };

  return (
    <List.Item key={`${FN_CONTENT_TYPE}_${id}`} disabled={stat === 0} className="filters-aside-ct">
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={t(`constants.content-types.${id}`)}
        checked={selected.includes(id)}
        onChange={handleSelect}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default withNamespaces()(ContentTypeItem);

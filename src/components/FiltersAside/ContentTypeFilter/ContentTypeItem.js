import React from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { FN_CONTENT_TYPE } from '../../../helpers/consts';
import { actions } from '../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const ContentTypeItem = ({ namespace, id, isSelChild = false, t }) => {
  const selected = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE))?.values || [];
  const stat     = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE))(id);

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

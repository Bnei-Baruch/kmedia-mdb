import React from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { CT_LESSONS, FN_CONTENT_TYPE } from '../../../helpers/consts';
import { actions } from '../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const ContentTypeItem = ({ namespace, id, isSelChild = false, t }) => {
  const isLesson = CT_LESSONS.includes(id);
  const selected = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE))?.values || [];
  const stat     = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE))(id);

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id).filter(x => !isLesson || !CT_LESSONS.includes(x));
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_CONTENT_TYPE, val));
  };

  const isSel = isLesson ? selected.some(id => CT_LESSONS.includes(id)) : selected.includes(id);

  return (
    <List.Item key={`${FN_CONTENT_TYPE}_${id}`} disabled={stat === 0} className="filters-aside-ct">
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={t(`filters.content-types.${id}`)}
        checked={isSel}
        onChange={handleSelect}
        indeterminate={isSelChild}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default withTranslation()(ContentTypeItem);

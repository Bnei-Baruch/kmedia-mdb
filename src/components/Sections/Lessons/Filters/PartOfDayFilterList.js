import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { FN_COLLECTION_MULTI, FN_CONTENT_TYPE, CT_DAILY_LESSON, FN_PART_OF_DAY } from '../../../../helpers/consts';
import { isEmpty } from '../../../../helpers/utils';
import { actions } from '../../../../redux/modules/filters';
import {
  filtersAsideGetStatsSelector,
  filtersGetFilterByNameSelector,
  filtersAsideGetTreeSelector
} from '../../../../redux/selectors';
import { useTranslation } from 'react-i18next';
import PartOfDayItem from './PartOfDayItem';

const PartOfDayFilterList = ({ namespace, ct }) => {
  const { t } = useTranslation();

  const stat = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE))(ct);

  const selectedCTFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE));
  const selectedCT        = useMemo(() => selectedCTFilters?.values || [], [selectedCTFilters]);
  const selectedDayPart   = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_PART_OF_DAY))?.values;
  const itemsDayPart      = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_PART_OF_DAY));

  const dispatch       = useDispatch();
  const handleSelectCt = (e, { checked }) => {
    const val = [...selectedCT].filter(x => x !== ct);
    if (checked) {
      val.push(ct);
      dispatch(actions.setFilterValueMulti(namespace, FN_PART_OF_DAY, null));
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_CONTENT_TYPE, val));
  };

  return (
    <List.Item key={`${FN_COLLECTION_MULTI}_${ct}`} disabled={stat === 0} className="filters-aside-ct">
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={t(`filters.content-types.${CT_DAILY_LESSON}`)}
        checked={selectedCT.includes(ct)}
        onChange={handleSelectCt}
        indeterminate={!selectedCT.includes(ct) && !isEmpty(selectedDayPart)}
        disabled={stat === 0}
      />
      <List>
        {itemsDayPart?.map(dayPart => <PartOfDayItem namespace={namespace} dayPart={dayPart} key={dayPart}/>)}
      </List>
    </List.Item>
  );
};

export default PartOfDayFilterList;

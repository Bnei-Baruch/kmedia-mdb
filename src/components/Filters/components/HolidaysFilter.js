import React, { useMemo } from 'react';
import countBy from 'lodash/countBy';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { CT_HOLIDAY } from '../../../helpers/consts';
import HierarchicalFilter from './HierarchicalFilter';
import { mdbGetCollectionByIdSelector, eventsGetEventByTypeSelector, tagsGetTagByIdSelector } from '../../../redux/selectors';

const getTree = (holidayEvents, getTagById, t) => {
  const counts = countBy(holidayEvents, x => x.holiday_id);
  return [
    {
      value   : 'root',
      text    : t('filters.holidays-filter.all'),
      count   : holidayEvents.length,
      children: Object.entries(counts).map(([tagID, count]) => buildNode(tagID, count, getTagById))
    }
  ];
};

const buildNode = (id, count, getTagById) => {
  const { label } = getTagById(id);
  return {
    value: id,
    text : label,
    count
  };
};

const HolidaysFilter = props => {
  const cIDs          = useSelector(state => eventsGetEventByTypeSelector(state, CT_HOLIDAY));
  const getTagById    = useSelector(tagsGetTagByIdSelector);
  const holidayEvents = useSelector(state => mdbGetCollectionByIdSelector(state, cIDs || []));

  const { t } = useTranslation();
  const tree  = useMemo(() => getTree(holidayEvents, getTagById, t), [holidayEvents, getTagById, t]);

  return <HierarchicalFilter name="holidays-filter" tree={tree} {...props} t={t}/>;
};

export default HolidaysFilter;

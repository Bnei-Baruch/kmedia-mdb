import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import countBy from 'lodash/countBy';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { CT_HOLIDAY } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/events';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as tags } from '../../../redux/modules/tags';
import HierarchicalFilter from './HierarchicalFilter';

const getTree = (holidayEvents, getTagById, t) => {
  const counts = countBy(holidayEvents, x => x.holiday_id);
  return [
    {
      value: 'root',
      text: t('filters.holidays-filter.all'),
      count: holidayEvents.length,
      children: Object.entries(counts).map(([tagID, count]) => buildNode(tagID, count, getTagById))
    }
  ];
};

const buildNode = (id, count, getTagById) => {
  const { label } = getTagById(id);
  return {
    value: id,
    text: label,
    count,
  };
};

const HolidaysFilter = (props) => {
  const cIDs = useSelector(state => selectors.getEventsByType(state.events)[CT_HOLIDAY]);
  const holidayEvents = useSelector(state => (cIDs || []).map(x => mdb.getCollectionById(state.mdb, x)));
  const getTagById = useSelector(state => tags.getTagById(state.tags));

  const { t } = props;
  const tree = useMemo(() => getTree(holidayEvents, getTagById, t), [holidayEvents, getTagById]); 

  return <HierarchicalFilter name="holidays-filter" tree={tree} {...props} />;
}

HolidaysFilter.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(HolidaysFilter);

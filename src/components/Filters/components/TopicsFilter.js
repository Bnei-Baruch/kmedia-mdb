import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { isEmpty } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/tags';
import { selectors as stats } from '../../../redux/modules/stats';
import HierarchicalFilter from './HierarchicalFilter';
import { getTree } from '../../../helpers/topricTree';

const TagsFilter = props => {
  const roots      = useSelector(state => selectors.getRoots(state.tags));
  const getTagById = useSelector(state => selectors.getTagById(state.tags));

  let cuStats = useSelector(state => stats.getCUStats(state.stats, props.namespace)) || { data: { tags: {} } };
  cuStats     = isEmpty(cuStats) || isEmpty(cuStats.data) ? null : cuStats.data.tags;

  const { t } = props;

  const tree = getTree(roots, getTagById, cuStats, t);

  return <HierarchicalFilter name="topics-filter" tree={tree} {...props} />;
};

export default withTranslation()(TagsFilter);

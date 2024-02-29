import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { isEmpty } from '../../../helpers/utils';
import HierarchicalFilter from './HierarchicalFilter';
import { getTree } from '../../../helpers/topicTree';
import { statsGetCUSelector, tagsGetRootsSelector, tagsGetTagByIdSelector } from '../../../redux/selectors';

const TagsFilter = props => {
  const roots      = useSelector(tagsGetRootsSelector);
  const getTagById = useSelector(tagsGetTagByIdSelector);

  let cuStats = useSelector(state => statsGetCUSelector(state, props.namespace)) || { data: { tags: {} } };
  cuStats     = isEmpty(cuStats) || isEmpty(cuStats.data) ? null : cuStats.data.tags;

  const { t } = props;

  const tree = getTree(roots, getTagById, cuStats, t);

  return <HierarchicalFilter name="topics-filter" tree={tree} {...props} />;
};

export default withTranslation()(TagsFilter);

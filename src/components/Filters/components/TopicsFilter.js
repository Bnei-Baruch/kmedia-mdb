import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { TOPICS_FOR_DISPLAY } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/tags';
import { selectors as stats } from '../../../redux/modules/stats';
import HierarchicalFilter from './HierarchicalFilter';

const getTree = (roots, getTagById, cuStats, t) => (
  [
    {
      value: 'root',
      text: t('filters.topics-filter.all'),
      children: roots
        ? roots
          .filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1)
          .map(x => buildNode(x, getTagById, cuStats))
        : null,
    }
  ]);

const buildNode = (id, getTagById, cuStats) => {
  const { label, children } = getTagById(id);
  return {
    value: id,
    text: label,
    count: cuStats ? cuStats[id] : null,
    children: children ? children.map(x => buildNode(x, getTagById, cuStats)) : null,
  };
};

const TagsFilter = (props) => {
  const { t }      = useTranslation('common', { useSuspense: false });
  const roots      = useSelector(state => selectors.getRoots(state.tags));
  const getTagById = useSelector(state => selectors.getTagById(state.tags));
  let cuStats      = useSelector(state => stats.getCUStats(state.stats, props.namespace)) || { data: { tags: {} } };
  cuStats          = isEmpty(cuStats) || isEmpty(cuStats.data) ? null : cuStats.data.tags;

  const tree = getTree(roots, getTagById, cuStats, t);

  return <HierarchicalFilter name="topics-filter" tree={tree} {...props} t={t} />;
};

export default TagsFilter;

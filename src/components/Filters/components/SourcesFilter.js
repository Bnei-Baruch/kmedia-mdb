import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';

import { isEmpty } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/sources';
import { selectors as stats } from '../../../redux/modules/stats';
import HierarchicalFilter from './HierarchicalFilter';

const getTree = (roots, getSourceById, cuStats, t) => {
  const root = {
    value: 'root',
    text: t('filters.sources-filter.all'),
    children: roots ? roots.map(x => buildNode(x, getSourceById, cuStats)) : null,
  };

  return [root];
};

const buildNode = (id, getSourceById, cuStats) => {
  const { name, children } = getSourceById(id);
  return {
    value: id,
    text: name,
    count: cuStats ? cuStats[id] : null,
    children: children ? children.map(x => buildNode(x, getSourceById, cuStats)) : null,
  };
};

const SourcesFilter = (props) => {
  const { namespace, t } = props;
  let cuStats = useSelector(state => stats.getCUStats(state.stats, namespace) || { data: { sources: {} } });
  cuStats     = isEmpty(cuStats) || isEmpty(cuStats.data) ? null : cuStats.data.sources;

  const roots = useSelector(state => selectors.getRoots(state.sources));
  const getSourceById = useSelector(state => selectors.getSourceById(state.sources));

  const tree = useMemo(() => getTree(roots, getSourceById, cuStats, t), [roots, getSourceById, cuStats, t]); 
  return <HierarchicalFilter name="sources-filter" tree={tree} {...props} />;
}

SourcesFilter.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(SourcesFilter);

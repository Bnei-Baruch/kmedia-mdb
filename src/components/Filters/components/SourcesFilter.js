import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { isEmpty } from '../../../helpers/utils';
import HierarchicalFilter from './HierarchicalFilter';
import { statsGetCUSelector, sourcesGetRootsSelector, sourcesGetSourceByIdSelector } from '../../../redux/selectors';

const getTree = (roots, getSourceById, cuStats, t) => {
  const root = {
    value   : 'root',
    text    : t('filters.sources-filter.all'),
    children: roots ? roots.map(x => buildNode(x, getSourceById, cuStats)) : null
  };

  return [root];
};

const buildNode = (id, getSourceById, cuStats) => {
  const { name, children } = getSourceById(id);
  return {
    value   : id,
    text    : name,
    count   : cuStats ? cuStats[id] : null,
    children: children ? children.map(x => buildNode(x, getSourceById, cuStats)) : null
  };
};

const SourcesFilter = props => {
  const { namespace, t } = props;
  let cuStats            = useSelector(state => statsGetCUSelector(state, namespace)) || undefined;
  cuStats                = isEmpty(cuStats) || isEmpty(cuStats.data) ? null : cuStats.data.sources;

  const roots         = useSelector(sourcesGetRootsSelector);
  const getSourceById = useSelector(sourcesGetSourceByIdSelector);

  const tree = useMemo(() => getTree(roots, getSourceById, cuStats, t), [roots, getSourceById, cuStats, t]);
  return <HierarchicalFilter name="sources-filter" tree={tree} {...props} />;
};

SourcesFilter.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation()(SourcesFilter);

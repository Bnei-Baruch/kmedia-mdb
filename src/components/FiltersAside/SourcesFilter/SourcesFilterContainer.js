import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectors as filters } from '../../../redux/modules/filters';
import { actions, selectors } from '../../../redux/modules/filtersAside';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import { FN_SOURCES_MULTI } from '../../../helpers/consts';
import SourcesFilter from './SourcesFilter';
import WipErr from '../../shared/WipErr/WipErr';
import { withNamespaces } from 'react-i18next';

const SourcesFilterContainer = ({ namespace, baseParams, t }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const selected     = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_SOURCES_MULTI))?.values || [];
  const isReady      = useSelector(state => selectors.isReady(state.filtersAside, namespace, FN_SOURCES_MULTI));
  const { wip, err } = useSelector(state => selectors.getWipErr(state.filtersAside, namespace));

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady)
      dispatch(actions.fetchStats(namespace, baseParams, true, FN_SOURCES_MULTI));
  }, [dispatch, baseParams]);

  useEffect(() => {
    if (isHydrated && isReady)
      dispatch(actions.fetchStats(namespace, baseParams, false, FN_SOURCES_MULTI));
  }, [dispatch, isHydrated, isReady, selected?.length]);

  const handleOnHydrated = () => setIsHydrated(true);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  return (
    <>
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <SourcesFilter namespace={namespace} />
    </>
  );
};

const areEqual = (prevProps, nextProps) => (
  prevProps.namespace === nextProps.namespace &&
  prevProps.baseParams === nextProps.baseParams
);

export default React.memo(withNamespaces()(SourcesFilterContainer), areEqual);

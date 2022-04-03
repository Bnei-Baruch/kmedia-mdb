import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/filtersAside';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import { FN_SOURCES_MULTI } from '../../../helpers/consts';
import { selectors as filters } from '../../../redux/modules/filters';
import DateFilter from '../../FiltersAside/DateFilter';
import Language from '../../FiltersAside/LanguageFilter/Language';
import ContentType from '../../FiltersAside/ContentTypeFilter/ContentType';
import TagSourceFilter from '../../FiltersAside/TopicsFilter/TagSourceFilter';
import FilterLabels from '../../FiltersAside/FilterLabels';
import { isEqual } from 'lodash';

const Filters = ({ namespace, baseParams }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const isReady      = useSelector(state => selectors.isReady(state.filtersAside, namespace));
  const { wip, err } = useSelector(state => selectors.getWipErr(state.filtersAside, namespace));
  const selected     = useSelector(state => filters.getFilters(state.filters, namespace), isEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, baseParams, true));
    }
  }, [dispatch, isReady]);

  useEffect(() => {
    if (selected, isHydrated && isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, baseParams, false));
    }
  }, [dispatch, isHydrated, isReady, selected]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <>
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <FilterLabels namespace={namespace} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <ContentType namespace={namespace} />
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </>
  );
};

const areEqual = (prevProps, nextProps) => prevProps.namespace === nextProps.namespace
  && prevProps.baseParams === nextProps.baseParams;

export default React.memo(Filters, areEqual);

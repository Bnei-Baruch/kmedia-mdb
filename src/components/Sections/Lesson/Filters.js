import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import { isEqual } from 'lodash';
import { useTranslation } from 'next-i18next';
import { Container, Header } from 'semantic-ui-react';

import { FN_SOURCES_MULTI, FN_TOPICS_MULTI } from '../../../helpers/consts';
import { selectors as filters } from '../../../../lib/redux/slices/filterSlice/filterSlice';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import Language from '../../../../lib/filters/components/LanguageFilter/Language';
import DateFilter from '../../../../lib/filters/components/DateFilter';
import TagSourceFilter from '../../../../lib/filters/components/TopicsFilter/TagSourceFilter';

const Filters = ({ namespace, baseParams }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const { t }        = useTranslation();
  const isReady      = useSelector(state => selectors.isReady(state.filterStats, namespace));
  const { wip, err } = useSelector(state => selectors.getStatus(state.filterStats, namespace));
  const selected     = useSelector(state => filters.getNotEmptyFilters(state.filters, namespace), isEqual);
  const prevSelRef   = useRef(-1);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, baseParams, { isPrepare: true }));
    }
  }, [dispatch, isReady, wip, err]);

  const selLen = selected.reduce((acc, x) => acc + x.values.length, 0);
  useEffect(() => {
    if (isHydrated && isReady && prevSelRef.current !== selLen) {
      dispatch(actions.fetchStats(namespace, baseParams, { isPrepare: false }));
      prevSelRef.current = selLen;
    }
  }, [dispatch, isHydrated, isReady, selLen]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};

export default Filters;

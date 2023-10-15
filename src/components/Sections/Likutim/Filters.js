'use client';
import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';

import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import { selectors } from '../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import CuNameFilter from '../../../../lib/filters/components/CuNameFilter';
import DateFilter from '../../../../lib/filters/components/DateFilter';
import Language from '../../../../lib/filters/components/LanguageFilter/Language';
import TagSourceFilter from '../../../../lib/filters/components/TopicsFilter/TagSourceFilter';
import { fetchStats } from '../../../../lib/redux/slices/filterSlice/thunks';

const Filters = ({ namespace, baseParams }) => {
  const { t }                              = useTranslation();
  const { wip, err, needRefresh, isReady } = useSelector(state => selectors.getStatus(state.filterStats, namespace));

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(fetchStats({ namespace, isPrepare: true, params: baseParams }));
    }
  }, [dispatch, isReady, baseParams]);

  useEffect(() => {
    if (isReady && needRefresh) {
      dispatch(fetchStats({ namespace, isPrepare: false, params: baseParams }));
    }
  }, [dispatch, isReady, baseParams, needRefresh]);

  return (
    <Container className="padded">
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <CuNameFilter namespace={namespace} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};

export default Filters;

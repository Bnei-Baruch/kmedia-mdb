'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next';

import { selectors } from '../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import { FN_SOURCES_MULTI } from '../../../helpers/consts';
import DateFilter from '../../../../lib/filters/components/DateFilter';
import Language from '../../../../lib/filters/components/LanguageFilter/Language';
import ContentType from '../../../../lib/filters/components/ContentTypeFilter/ContentType';
import TagSourceFilter from '../../../../lib/filters/components/TopicsFilter/TagSourceFilter';
import SubTopics from './SubTopics';
import { fetchStats } from '../../../../lib/redux/slices/filterSlice/thunks';

const Filters = ({ namespace, baseParams }) => {
  const { t }    = useTranslation();
  const dispatch = useDispatch();

  const { wip, err, needRefresh, isReady } = useSelector(state => selectors.getStatus(state.filterStats, namespace));

  useEffect(() => {
    if (!isReady && !wip && !err) {
      const _args = {
        namespace,
        isPrepare: true,
        params: { ...baseParams, countC: true, countL: true }
      };
      dispatch(fetchStats(_args));
    }
  }, [isReady, baseParams, wip, err, namespace, dispatch]);

  useEffect(() => {
    if (isReady && needRefresh) {
      const _args = {
        namespace,
        isPrepare: false,
        params: { ...baseParams, countC: true, countL: true }
      };
      dispatch(fetchStats(_args));
    }
  }, [isReady, needRefresh, baseParams, namespace, dispatch]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <SubTopics namespace={namespace} rootID={baseParams.tag} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <ContentType namespace={namespace} />
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};

export default Filters;

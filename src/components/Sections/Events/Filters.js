'use client';
import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';
import { FN_SOURCES_MULTI, FN_TOPICS_MULTI } from '../../../helpers/consts';
import { selectors } from '../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import DateFilter from '../../../../lib/filters/components/DateFilter';
import Language from '../../../../lib/filters/components/LanguageFilter/Language';
import Locations from '../../../../lib/filters/components/LocationsFilter/Locations';
import OriginalLanguageFilter from '../../../../lib/filters/components/OriginalLanguageFilter/OriginalLanguage';
import TagSourceFilter from '../../../../lib/filters/components/TopicsFilter/TagSourceFilter';
import ContentTypesFilter from './ContentTypesFilter';
import { fetchStats } from '../../../../lib/redux/slices/filterSlice/thunks';

const Filters = ({ namespace, baseParams }) => {
  const { t }                              = useTranslation();
  const { wip, err, needRefresh, isReady } = useSelector(state => selectors.getStatus(state.filterStats, namespace));


  const dispatch = useDispatch();
  useEffect(() => {
    if (!isReady && !wip && !err) {
      const _args = {
        namespace,
        isPrepare: true,
        countC: true,
        params: { ...baseParams, with_original_languages: true, with_locations: true, with_collections: true, },
      };
      dispatch(fetchStats(_args));
    }
  }, [dispatch, isReady]);

  useEffect(() => {
    if (isReady && needRefresh) {
      const _args = {
        namespace,
        isPrepare: false,
        countC: true,
        params: { ...baseParams, with_original_languages: true, with_locations: true, with_collections: true, },
      };
      dispatch(fetchStats(_args));
    }
  }, [dispatch, isReady, baseParams, needRefresh]);

  return (
    <Container className="padded">
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <ContentTypesFilter namespace={namespace} />
      <Locations namespace={namespace} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <Language namespace={namespace} />
      <OriginalLanguageFilter namespace={namespace} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};

export default Filters;

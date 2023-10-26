'use client';
import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';

import { COLLECTION_PROGRAMS_TYPE, FN_SOURCES_MULTI, FN_TOPICS_MULTI, PAGE_NS_PROGRAMS } from '../../../helpers/consts';
import { selectors } from '../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import DateFilter from '../../../../lib/filters/components/DateFilter';
import Language from '../../../../lib/filters/components/LanguageFilter/Language';
import MediaTypeFilter from '../../../../lib/filters/components/MediaTypeFilter/MediaType';
import OriginalLanguageFilter from '../../../../lib/filters/components/OriginalLanguageFilter/OriginalLanguage';
import TagSourceFilter from '../../../../lib/filters/components/TopicsFilter/TagSourceFilter';
import ContentTypesFilter from './ContentTypesFilter';
import { fetchPreparePage } from '../../../../lib/redux/slices/preparePageSlice/thunks';
import { fetchStats } from '../../../../lib/redux/slices/filterSlice/thunks';

const Filters = ({ namespace, baseParams }) => {
  const { t }    = useTranslation();
  const dispatch = useDispatch();

  const { wip, err, needRefresh, isReady } = useSelector(state => selectors.getStatus(state.filterStats, namespace));

  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(fetchPreparePage({ namespace: PAGE_NS_PROGRAMS, content_type: COLLECTION_PROGRAMS_TYPE }));
    }
  }, [isReady, wip, err, dispatch]);

  useEffect(() => {
    if (!isReady && !wip && !err) {
      const _args = {
        namespace,
        isPrepare: true,
        params: {
          ...baseParams,
          with_media: true,
          with_original_languages: true,
          with_collections: true,
        }
      };
      dispatch(fetchStats(_args));
    }
  }, [isReady, baseParams, wip, err, namespace, dispatch]);

  useEffect(() => {
    if (isReady && needRefresh) {
      const _args = {
        namespace,
        isPrepare: false,
        params: {
          ...baseParams,
          with_media: true,
          with_original_languages: true,
          with_collections: true,
        }
      };
      dispatch(fetchStats(_args));
    }
  }, [isReady, needRefresh, baseParams, namespace, dispatch]);

  return (
    <Container className="padded">
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <ContentTypesFilter namespace={namespace} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <Language namespace={namespace} />
      <OriginalLanguageFilter namespace={namespace} />
      <DateFilter namespace={namespace} />
      <MediaTypeFilter namespace={namespace} />
    </Container>
  );
};

export default Filters;

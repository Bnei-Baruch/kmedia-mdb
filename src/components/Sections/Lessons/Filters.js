'use client';
import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';
import { FN_SOURCES_MULTI, FN_TOPICS_MULTI, CT_VIRTUAL_LESSONS } from '../../../helpers/consts';
import { fetchStat } from '../../../../lib/redux/slices/filterSlice/thunks';
import DateFilter from '../../../../lib/filters/components/DateFilter';
import Language from '../../../../lib/filters/components/LanguageFilter/Language';
import MediaTypeFilter from '../../../../lib/filters/components/MediaTypeFilter/MediaType';
import OriginalLanguageFilter from '../../../../lib/filters/components/OriginalLanguageFilter/OriginalLanguage';
import PersonFilter from '../../../../lib/filters/components/PersonFilter/Person';
import TagSourceFilter from '../../../../lib/filters/components/TopicsFilter/TagSourceFilter';
import ContentTypeFilter from './ContentTypeFilter';
import { preparePageSlice } from '../../../../lib/redux/slices/preparePageSlice/preparePageSlice';
import { selectors } from '/lib/redux/slices/filterSlice/filterStatsSlice';
import { fetchPreparePage } from '../../../../lib/redux/slices/preparePageSlice/thunks';

const Filters = ({ namespace, baseParams }) => {
  const { t } = useTranslation();

  const { wip, err, needRefresh, isReady } = useSelector(state => selectors.getStatus(state.filterStats, namespace));

   const dispatch = useDispatch();
   useEffect(() => {
     if (!isReady && !wip && !err) {
       dispatch(fetchPreparePage({ namespace, content_type: [CT_VIRTUAL_LESSONS] }));
     }
   }, [isReady, wip, err]);

   useEffect(() => {
     if (!isReady && !wip && !err) {
       const _args = {
         namespace,
         isPrepare: true,
         countC: true,
         params: {
           ...baseParams,
           with_collections: true,
           with_persons: true,
           with_media: true,
           with_original_languages: true,
         }
       };
       dispatch(fetchStat(_args));
     }
   }, [isReady, baseParams, wip, err, namespace, dispatch]);

   useEffect(() => {
     if (isReady && needRefresh) {
       const _args = {
         namespace,
         isPrepare: false,
         countC: true,
         params: {
           ...baseParams,
           with_collections: true,
           with_persons: true,
           with_media: true,
           with_original_languages: true,
         }
       };
       dispatch(fetchStat(_args));
     }
   }, [isReady, needRefresh, baseParams, namespace, dispatch]);

  return (
    <Container className="padded">
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <ContentTypeFilter namespace={namespace} />
      <PersonFilter namespace={namespace} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <Language namespace={namespace} />
      <OriginalLanguageFilter namespace={namespace} />
      <DateFilter namespace={namespace} />
      <MediaTypeFilter namespace={namespace} />
    </Container>
  );
};

export default Filters;

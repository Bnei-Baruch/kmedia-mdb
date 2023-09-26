import { isEqual } from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';

import { COLLECTION_PROGRAMS_TYPE, FN_SOURCES_MULTI, FN_TOPICS_MULTI, PAGE_NS_PROGRAMS } from '../../../helpers/consts';
import { selectors as filters } from '../../../../lib/redux/slices/filterSlice/filterSlice';
import { actions, selectors } from '../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import { actions as prepareActions } from '../../../../lib/redux/slices/preparePageSlice/preparePageSlice';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import DateFilter from '../../../../lib/filters/FiltersAside/DateFilter';
import Language from '../../../../lib/filters/FiltersAside/LanguageFilter/Language';
import MediaTypeFilter from '../../../../lib/filters/FiltersAside/MediaTypeFilter/MediaType';
import OriginalLanguageFilter from '../../../../lib/filters/FiltersAside/OriginalLanguageFilter/OriginalLanguage';
import TagSourceFilter from '../../../../lib/filters/FiltersAside/TopicsFilter/TagSourceFilter';
import ContentTypesFilter from './ContentTypesFilter';

const Filters = ({ namespace, baseParams }) => {
  const { t } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);

  const isReady  = useSelector(state => selectors.isReady(state.filterStats, namespace));
  const selected = useSelector(state => filters.getNotEmptyFilters(state.filters, namespace), isEqual);
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));
  const prevSelRef = useRef(-1);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(prepareActions.fetchCollections(PAGE_NS_PROGRAMS, { content_type: COLLECTION_PROGRAMS_TYPE }));
  }, [contentLanguages, dispatch]);

  useEffect(() => {
    if (!isReady) {
      dispatch(actions.fetchStats(namespace, {
        ...baseParams,
        with_media: true,
        with_original_languages: true,
        with_collections: true,
      }, { isPrepare: true }));
    }
  }, [dispatch, isReady, baseParams]);

  const selLen = selected.reduce((acc, x) => acc + x.values.length, 0);
  useEffect(() => {
    if (isHydrated && isReady && prevSelRef.current !== selLen) {
      dispatch(actions.fetchStats(namespace, {
        ...baseParams,
        with_media: true,
        with_original_languages: true,
        with_collections: true,
      }, { isPrepare: false }));
      prevSelRef.current = selLen;
    }
  }, [dispatch, isHydrated, isReady, namespace, baseParams, selLen]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
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

import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';
import { FN_SOURCES_MULTI, FN_TOPICS_MULTI } from '../../../helpers/consts';

import { selectors as filters } from '../../../../lib/redux/slices/filterSlice/filterSlice';
import { actions, selectors } from '../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import DateFilter from '../../../../lib/filters/components/DateFilter';
import Language from '../../../../lib/filters/components/LanguageFilter/Language';
import Locations from '../../../../lib/filters/components/LocationsFilter/Locations';
import OriginalLanguageFilter from '../../../../lib/filters/components/OriginalLanguageFilter/OriginalLanguage';
import TagSourceFilter from '../../../../lib/filters/components/TopicsFilter/TagSourceFilter';
import ContentTypesFilter from './ContentTypesFilter';

const Filters = ({ namespace, baseParams }) => {
  const { t }        = useTranslation();
  const isReady      = useSelector(state => selectors.isReady(state.filterStats, namespace));
  const { wip, err } = useSelector(state => selectors.getStatus(state.filterStats, namespace));
  const selected     = useSelector(state => filters.getNotEmptyFilters(state.filters, namespace));
  const prevSelRef   = useRef(-1);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace,
        { ...baseParams, with_original_languages: true, with_locations: true, with_collections: true, },
        { isPrepare: true, countC: true }));
    }
  }, [dispatch, isReady]);

  const selLen = selected.reduce((acc, x) => acc + x.values.length, 0);
  useEffect(() => {
    if (isReady && prevSelRef.current !== selLen) {
      dispatch(actions.fetchStats(namespace,
        { ...baseParams, with_original_languages: true, with_locations: true, with_collections: true, },
        { isPrepare: false, countC: true }
      ));
      prevSelRef.current = selLen;
    }
  }, [dispatch, isReady, baseParams, selLen]);

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

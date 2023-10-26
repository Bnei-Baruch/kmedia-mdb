import { isEqual } from 'lodash';
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
import OriginalLanguageFilter from '../../../../lib/filters/components/OriginalLanguageFilter/OriginalLanguage';
import TagSourceFilter from '../../../../lib/filters/components/TopicsFilter/TagSourceFilter';
import ContentTypeFilter from './ContentTypeFilter';
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
        params: {
          ...baseParams,
          with_original_languages: true,
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
          with_original_languages: true,
        }
      };
      dispatch(fetchStats(_args));
    }
  }, [isReady, needRefresh, baseParams, namespace, dispatch]);

  return (
    <Container className="padded">
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <ContentTypeFilter namespace={namespace} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <Language namespace={namespace} />
      <OriginalLanguageFilter namespace={namespace} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};

export default Filters;

import { isEqual } from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';
import { FN_SOURCES_MULTI, FN_TOPICS_MULTI } from '../../../helpers/consts';

import { selectors as filters } from '../../../../lib/redux/slices/filterSlice/filterSlice';
import { actions, selectors } from '../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import DateFilter from '../../../../lib/filters/FiltersAside/DateFilter';
import Language from '../../../../lib/filters/FiltersAside/LanguageFilter/Language';
import OriginalLanguageFilter from '../../../../lib/filters/FiltersAside/OriginalLanguageFilter/OriginalLanguage';
import TagSourceFilter from '../../../../lib/filters/FiltersAside/TopicsFilter/TagSourceFilter';
import ContentTypeFilter from './ContentTypeFilter';

const Filters = ({ namespace, baseParams }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const { t }        = useTranslation();
  const isReady      = useSelector(state => selectors.isReady(state.filterStats, namespace));
  const { wip, err } = useSelector(state => selectors.getStatus(state.filterStats, namespace));
  const selected     = useSelector(state => filters.getNotEmptyFilters(state.filters, namespace), isEqual);
  const prevSelRef   = useRef(-1);

  const dispatch = useDispatch();
  const _isReady = !isReady && !wip && !err;
  useEffect(() => {
    if (_isReady) {
      dispatch(actions.fetchStats(namespace,
        { ...baseParams, with_original_languages: true },
        { isPrepare: true }
      ));
    }
  }, [namespace, _isReady, baseParams, dispatch]);

  const selLen = selected.reduce((acc, x) => acc + x.values.length, 0);
  useEffect(() => {
    if (isHydrated && isReady && prevSelRef.current !== selLen) {
      dispatch(actions.fetchStats(namespace,
        { ...baseParams, with_original_languages: true },
        { isPrepare: false }
      ));
      prevSelRef.current = selLen;
    }
  }, [isHydrated, isReady, selLen, baseParams, namespace, dispatch]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
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

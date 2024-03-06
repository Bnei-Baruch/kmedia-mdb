import { isEqual } from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';
import { FN_SOURCES_MULTI, FN_TOPICS_MULTI } from '../../../helpers/consts';

import { actions } from '../../../redux/modules/filtersAside';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import DateFilter from '../../FiltersAside/DateFilter';
import Language from '../../FiltersAside/LanguageFilter/Language';
import OriginalLanguageFilter from '../../FiltersAside/OriginalLanguageFilter/OriginalLanguage';
import TagSourceFilter from '../../FiltersAside/TopicsFilter/TagSourceFilter';
import ContentTypeFilter from './ContentTypeFilter';
import {
  filtersAsideGetIsReadySelector,
  filtersGetNotEmptyFiltersSelector,
  filtersAsideGetWipErrSelector
} from '../../../redux/selectors';

const Filters = ({ namespace, baseParams }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const { t }        = useTranslation();
  const isReady      = useSelector(state => filtersAsideGetIsReadySelector(state, namespace));
  const { wip, err } = useSelector(state => filtersAsideGetWipErrSelector(state, namespace));
  const selected     = useSelector(state => filtersGetNotEmptyFiltersSelector(state, namespace), isEqual);
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
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated}/>
      <Header as="h3" content={t('filters.aside-filter.filters-title')}/>
      <ContentTypeFilter namespace={namespace}/>
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI}/>
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI}/>
      <Language namespace={namespace}/>
      <OriginalLanguageFilter namespace={namespace}/>
      <DateFilter namespace={namespace}/>
    </Container>
  );
};

export default Filters;

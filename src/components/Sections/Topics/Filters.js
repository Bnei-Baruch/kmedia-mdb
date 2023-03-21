import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import { actions, selectors } from '../../../redux/modules/filtersAside';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import { FN_SOURCES_MULTI } from '../../../helpers/consts';
import { selectors as filters } from '../../../redux/modules/filters';
import DateFilter from '../../FiltersAside/DateFilter';
import Language from '../../FiltersAside/LanguageFilter/Language';
import ContentType from '../../FiltersAside/ContentTypeFilter/ContentType';
import TagSourceFilter from '../../FiltersAside/TopicsFilter/TagSourceFilter';
import SubTopics from './SubTopics';

const Filters = ({ namespace, baseParams }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { t }                       = useTranslation();

  const isReady    = useSelector(state => selectors.isReady(state.filtersAside, namespace));
  const selected   = useSelector(state => filters.getNotEmptyFilters(state.filters, namespace));
  const prevSelRef = useRef(-1);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady) {
      dispatch(actions.fetchStats(namespace, baseParams, { isPrepare: true, countC: true, countL: true }));
    }
  }, [isReady, baseParams, namespace, dispatch]);

  const needFetch = isHydrated && isReady;
  const selLen    = selected.reduce((acc, x) => acc + x.values.length, 0);
  useEffect(() => {
    if (needFetch && prevSelRef.current !== selLen) {
      dispatch(actions.fetchStats(namespace, baseParams, { isPrepare: false, countC: true, countL: true }));
      prevSelRef.current = selLen;
    }
  }, [needFetch, selLen, baseParams, namespace, dispatch]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
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

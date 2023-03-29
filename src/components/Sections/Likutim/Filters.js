import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';

import { selectors as filters } from '../../../redux/modules/filters';
import { actions, selectors } from '../../../redux/modules/filtersAside';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import CuNameFilter from '../../FiltersAside/CuNameFilter';
import DateFilter from '../../FiltersAside/DateFilter';
import Language from '../../FiltersAside/LanguageFilter/Language';
import TagSourceFilter from '../../FiltersAside/TopicsFilter/TagSourceFilter';

const Filters = ({ namespace, baseParams }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const { t }        = useTranslation();
  const isReady      = useSelector(state => selectors.isReady(state.filtersAside, namespace));
  const { wip, err } = useSelector(state => selectors.getWipErr(state.filtersAside, namespace));
  const selected     = useSelector(state => filters.getNotEmptyFilters(state.filters, namespace));
  const prevSelRef   = useRef(-1);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, baseParams, { isPrepare: true, }));
    }
  }, [dispatch, isReady, baseParams]);

  const selLen = selected.reduce((acc, x) => acc + x.values.length, 0);
  useEffect(() => {
    if (isHydrated && isReady && prevSelRef.current !== selLen) {
      dispatch(actions.fetchStats(namespace, baseParams, { isPrepare: false, }));
      prevSelRef.current = selLen;
    }
  }, [dispatch, isHydrated, isReady, selLen, baseParams, namespace]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <CuNameFilter namespace={namespace} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};

export default Filters;

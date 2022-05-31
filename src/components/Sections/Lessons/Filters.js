import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/filtersAside';
import { isEqual } from 'lodash';
import { withNamespaces } from 'react-i18next';
import { Container, Header } from 'semantic-ui-react';

import { FN_DATE_FILTER, FN_SOURCES_MULTI, FN_TOPICS_MULTI } from '../../../helpers/consts';
import { selectors as filters } from '../../../redux/modules/filters';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import Language from '../../FiltersAside/LanguageFilter/Language';
import DateFilter from '../../FiltersAside/DateFilter';
import TagSourceFilter from '../../FiltersAside/TopicsFilter/TagSourceFilter';

const Filters = ({ namespace, baseParams, t }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const isReady      = useSelector(state => selectors.isReady(state.filtersAside, namespace));
  const { wip, err } = useSelector(state => selectors.getWipErr(state.filtersAside, namespace));
  const selected     = useSelector(state => filters.getFilters(state.filters, namespace), isEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady && !wip && !err) {
      const countC = !selected.find(f => f.name !== FN_DATE_FILTER);
      dispatch(actions.fetchStats(namespace, { ...baseParams }, { isPrepare: true, countC: true }));
    }
  }, [dispatch, isReady]);

  useEffect(() => {
    if (isHydrated && isReady) {
      const countC = !selected.find(f => f.name !== FN_DATE_FILTER);
      dispatch(actions.fetchStats(namespace, { ...baseParams }, { isPrepare: false, countC }));
    }
  }, [dispatch, isHydrated, isReady, selected]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};

export default withNamespaces()(Filters);

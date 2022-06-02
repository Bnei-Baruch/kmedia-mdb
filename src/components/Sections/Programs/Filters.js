import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { withNamespaces } from 'react-i18next';
import { Container, Header } from 'semantic-ui-react';

import {
  COLLECTION_PROGRAMS_TYPE,
  FN_SOURCES_MULTI,
  FN_TOPICS_MULTI, PAGE_NS_PROGRAMS
} from '../../../helpers/consts';
import { actions as prepareActions } from '../../../redux/modules/preparePage';
import { actions, selectors } from '../../../redux/modules/filtersAside';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as filters } from '../../../redux/modules/filters';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import TagSourceFilter from '../../FiltersAside/TopicsFilter/TagSourceFilter';
import Language from '../../FiltersAside/LanguageFilter/Language';
import DateFilter from '../../FiltersAside/DateFilter';
import ContentTypesFilter from './ContentTypesFilter';

const Filters = ({ namespace, baseParams, t }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const isReady      = useSelector(state => selectors.isReady(state.filtersAside, namespace));
  const { wip, err } = useSelector(state => selectors.getWipErr(state.filtersAside, namespace));
  const selected     = useSelector(state => filters.getFilters(state.filters, namespace), isEqual);
  const language     = useSelector(state => settings.getLanguage(state.settings));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(prepareActions.fetchCollections(PAGE_NS_PROGRAMS, { content_type: COLLECTION_PROGRAMS_TYPE }));
  }, [language, dispatch]);

  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, { with_collections: true, ...baseParams }, { isPrepare: true }));
    }
  }, [dispatch, isReady]);

  useEffect(() => {
    if (isHydrated && isReady) {
      dispatch(actions.fetchStats(namespace, { with_collections: true, ...baseParams }, { isPrepare: false, }));
    }
  }, [dispatch, isHydrated, isReady, selected]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <ContentTypesFilter namespace={namespace} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};

export default withNamespaces()(Filters);

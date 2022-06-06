import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';
import { isEqual } from 'lodash';

import {
  CT_VIRTUAL_LESSONS,
  FN_SOURCES_MULTI,
  FN_TOPICS_MULTI,
  PAGE_NS_LESSONS
} from '../../../helpers/consts';
import { actions as prepareActions } from '../../../redux/modules/preparePage';
import { actions, selectors } from '../../../redux/modules/filtersAside';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as filters } from '../../../redux/modules/filters';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import TagSourceFilter from '../../FiltersAside/TopicsFilter/TagSourceFilter';
import Language from '../../FiltersAside/LanguageFilter/Language';
import DateFilter from '../../FiltersAside/DateFilter';
import ContentTypeFilter from './ContentTypeFilter';

const Filters = ({ namespace, baseParams, t }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const language     = useSelector(state => settings.getLanguage(state.settings));
  const isReady      = useSelector(state => selectors.isReady(state.filtersAside, namespace));
  const { wip, err } = useSelector(state => selectors.getWipErr(state.filtersAside, namespace));
  const selected     = useSelector(state => filters.getFilters(state.filters, namespace), isEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(prepareActions.fetchCollections(PAGE_NS_LESSONS, { content_type: [CT_VIRTUAL_LESSONS] }));
  }, [language, dispatch]);

  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, { ...baseParams, with_collections: true }, { isPrepare: true, countC: true }));
    }
  }, [dispatch, isReady]);

  useEffect(() => {
    if (isHydrated && isReady) {
      dispatch(actions.fetchStats(namespace, { ...baseParams, with_collections: true }, { isPrepare: false, countC: true }));
    }
  }, [dispatch, isHydrated, isReady, selected]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <ContentTypeFilter namespace={namespace} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};

export default withNamespaces()(Filters);

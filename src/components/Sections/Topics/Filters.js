import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/filtersAside';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import { FN_SOURCES_MULTI } from '../../../helpers/consts';
import { selectors as filters } from '../../../redux/modules/filters';
import DateFilter from '../../FiltersAside/DateFilter';
import Language from '../../FiltersAside/LanguageFilter/Language';
import ContentType from '../../FiltersAside/ContentTypeFilter/ContentType';
import TagSourceFilter from '../../FiltersAside/TopicsFilter/TagSourceFilter';
import { isEqual } from 'lodash';
import { Container, Header } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';

const Filters = ({ namespace, baseParams, t }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const isReady      = useSelector(state => selectors.isReady(state.filtersAside, namespace));
  const { wip, err } = useSelector(state => selectors.getWipErr(state.filtersAside, namespace));
  const selected     = useSelector(state => filters.getFilters(state.filters, namespace), isEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, baseParams, true));
    }
  }, [dispatch, isReady]);

  useEffect(() => {
    if (selected, isHydrated && isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, baseParams, false));
    }
  }, [dispatch, isHydrated, isReady, selected]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <Header as="h3" content={t('topics.filters-title')} />
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <ContentType namespace={namespace} />
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};
export default withNamespaces()(Filters);

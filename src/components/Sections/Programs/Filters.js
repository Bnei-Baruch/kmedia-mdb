import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/filtersAside';
import { isEqual } from 'lodash';
import { withNamespaces } from 'react-i18next';
import { Container, Header } from 'semantic-ui-react';

import {
  COLLECTION_PROGRAMS_TYPE,
  FN_CONTENT_TYPE,
  FN_SOURCES_MULTI,
  FN_TOPICS_MULTI,
  UNIT_PROGRAMS_TYPE
} from '../../../helpers/consts';
import { selectors as filters } from '../../../redux/modules/filters';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import Language from '../../FiltersAside/LanguageFilter/Language';
import DateFilter from '../../FiltersAside/DateFilter';
import TagSourceFilter from '../../FiltersAside/TopicsFilter/TagSourceFilter';
import ContentTypeItem from '../../FiltersAside/ContentTypeFilter/ContentTypeItem';
import FilterHeader from '../../FiltersAside/FilterHeader';
import Collections from '../../FiltersAside/CollectionFilter/Collections';

const Filters = ({ namespace, baseParams, t }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const isReady = useSelector(state => selectors.isReady(state.filtersAside, namespace));
  const { wip, err } = useSelector(state => selectors.getWipErr(state.filtersAside, namespace));
  const selected = useSelector(state => filters.getFilters(state.filters, namespace), isEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, baseParams, { isPrepare: true }));
    }
  }, [dispatch, isReady]);

  useEffect(() => {
    if (isHydrated && isReady) {
      dispatch(actions.fetchStats(namespace, baseParams, { isPrepare: false }));
    }
  }, [dispatch, isHydrated, isReady, selected]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <FilterHeader
        filterName={FN_CONTENT_TYPE}
        children={
          UNIT_PROGRAMS_TYPE.map(id => <ContentTypeItem namespace={namespace} id={id} key={id} />)
        }
      />
      <Collections namespace={namespace} ctOnly={COLLECTION_PROGRAMS_TYPE} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};

export default withNamespaces()(Filters);

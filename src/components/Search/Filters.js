import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../redux/modules/filtersAside';
import FiltersHydrator from '../Filters/FiltersHydrator';
import { FN_SOURCES_MULTI } from '../../helpers/consts';
import DateFilter from '../FiltersAside/DateFilter';
import TagSourceFilter from '../FiltersAside/TopicsFilter/TagSourceFilter';
import { Container, Header } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';

const Filters = ({ namespace, baseParams, t }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const { wip, err } = useSelector(state => selectors.getWipErr(state.filtersAside, namespace));

  const dispatch = useDispatch();

  useEffect(() => {
    if (isHydrated && !wip && !err) {
      dispatch(actions.fetchElasticStats(namespace, baseParams, false));
    }
  }, [dispatch, isHydrated]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <DateFilter namespace={namespace} />
    </Container>
  );
};

export default withNamespaces()(Filters);

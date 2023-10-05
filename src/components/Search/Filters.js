import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Container, Header, List, Segment } from 'semantic-ui-react';

import { actions, selectors } from '../../../lib/redux/slices/filterSlice/filterStatsSlice';
import { selectors as search, actions as searchActions } from '../../../lib/redux/slices/searchSlice/searchSlice';
import { FN_SORT_BY_FILTER, FN_TOPICS_MULTI, FN_SOURCES_MULTI } from '../../helpers/consts';

import FiltersHydrator from '../Filters/FiltersHydrator';
import FilterHeader from '../../../lib/filters/components/FilterHeader';
import Language from '../../../lib/filters/components/LanguageFilter/Language';
import DateFilter from '../../../lib/filters/components/DateFilter';
import TagSourceFilter from '../../../lib/filters/components/TopicsFilter/TagSourceFilter';
import ContentType from '../../../lib/filters/components/ContentTypeFilter/ContentType';
import PersonFilter from '../../../lib/filters/components/PersonFilter/Person';
import OriginalLanguageFilter from '../../../lib/filters/components/OriginalLanguageFilter/OriginalLanguage';

const SORTS = ['relevance', 'newertoolder', 'oldertonewer'];

const SortBy = ({ namespace, t }) => {
  const sortBy = useSelector(state => search.getSortBy(state.search, namespace));

  const dispatch = useDispatch();

  const onSortByChange = (e, data) => {
    dispatch(searchActions.setSortBy(data.value));
  };

  const renderSortBy = () => (
    <Segment.Group className="filter-popup__wrapper">
      {SORTS.map(sort => (
        <List.Item key={sort}>
          <List.Content>
            <Checkbox
              label={t(`search.sorts.${sort}`)}
              checked={sortBy === sort}
              value={sort}
              onChange={onSortByChange}
            />
          </List.Content>
        </List.Item>
      ))}
    </Segment.Group>
  );

  return (
    <FilterHeader
      filterName={FN_SORT_BY_FILTER}
      children={renderSortBy()}
    />
  );
};

const Filters = ({ namespace }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const { t }        = useTranslation();
  const { wip, err } = useSelector(state => selectors.getStatus(state.filterStats, namespace));

  const dispatch = useDispatch();

  useEffect(() => {
    if (isHydrated && !wip && !err) {
      dispatch(actions.fetchElasticStats(namespace));
    }
  }, [dispatch, isHydrated]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <Container className="padded">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <ContentType namespace={namespace} />
      <PersonFilter namespace={namespace} />
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <Language namespace={namespace} />
      <OriginalLanguageFilter namespace={namespace} />
      <DateFilter namespace={namespace} />
      <SortBy namespace={namespace} t={t} />
    </Container>
  );
};

export default Filters;

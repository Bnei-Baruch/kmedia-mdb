import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../redux/modules/filtersAside';
import { actions as searchActions } from '../../redux/modules/search';
import { FN_SORT_BY_FILTER, FN_TOPICS_MULTI, FN_SOURCES_MULTI } from '../../helpers/consts';

import FiltersHydrator from '../Filters/FiltersHydrator';
import FilterHeader from '../FiltersAside/FilterHeader';
import Language from '../FiltersAside/LanguageFilter/Language';
import DateFilter from '../FiltersAside/DateFilter';
import TagSourceFilter from '../FiltersAside/TopicsFilter/TagSourceFilter';
import ContentType from '../FiltersAside/ContentTypeFilter/ContentType';
import PersonFilter from '../FiltersAside/PersonFilter/Person';
import OriginalLanguageFilter from '../FiltersAside/OriginalLanguageFilter/OriginalLanguage';
import { filtersAsideGetWipErrSelector, searchGetSortBySelector } from '../../redux/selectors';

const SORTS = ['relevance', 'newertoolder', 'oldertonewer'];

const SortBy = ({ namespace, t }) => {
  const sortBy = useSelector(state => searchGetSortBySelector(state, namespace));

  const dispatch = useDispatch();

  const onSortByChange = (e, data) => {
    dispatch(searchActions.setSortBy(data.value));
  };

  const renderSortBy = () => (
    <div className="filter-popup__wrapper border rounded">
      {SORTS.map(sort => (
        <li key={sort} className="list-none">
          <div>
            <label className="flex items-center gap-2 cursor-pointer px-2 py-1">
              <input
                type="checkbox"
                checked={sortBy === sort}
                onChange={() => onSortByChange(null, { value: sort })}
              />
              {t(`search.sorts.${sort}`)}
            </label>
          </div>
        </li>
      ))}
    </div>
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
  const { wip, err } = useSelector(state => filtersAsideGetWipErrSelector(state, namespace));

  const dispatch = useDispatch();

  useEffect(() => {
    if (isHydrated && !wip && !err) {
      dispatch(actions.fetchElasticStats(namespace));
    }
  }, [dispatch, isHydrated]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <div className=" px-4 ">
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated}/>
      <h3>{t('filters.aside-filter.filters-title')}</h3>
      <ContentType namespace={namespace}/>
      <PersonFilter namespace={namespace}/>
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI}/>
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI}/>
      <Language namespace={namespace}/>
      <OriginalLanguageFilter namespace={namespace}/>
      <DateFilter namespace={namespace}/>
      <SortBy namespace={namespace} t={t}/>
    </div>
  );
};

export default Filters;

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import * as shapes from '../../shapes';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import Filters from '../../Filters/Filters';
import filterComponents from '../../Filters/components';
import WipErr from '../../shared/WipErr/WipErr';

const filters = {
  'lessons-daily': [
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
    { name: 'language-filter', component: filterComponents.LanguageFilter },
  ],
  'lessons-virtual': [
    { name: 'collections-filter', component: filterComponents.CollectionsFilter },
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
    { name: 'language-filter', component: filterComponents.LanguageFilter },
  ],
  'lessons-lectures': [
    { name: 'collections-filter', component: filterComponents.CollectionsFilter },
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
    { name: 'language-filter', component: filterComponents.LanguageFilter },
  ],
  'lessons-women': [
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
    { name: 'language-filter', component: filterComponents.LanguageFilter },
  ],
  'lessons-rabash': [
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'language-filter', component: filterComponents.LanguageFilter },
  ],
  'lessons-children': [
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
  ],
  'lessons-collection': [
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
  ],
  'programs-main': [
    { name: 'collections-filter', component: filterComponents.CollectionsFilter },
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
    { name: 'language-filter', component: filterComponents.LanguageFilter },
  ],
  'programs-clips': [
    { name: 'collections-filter', component: filterComponents.CollectionsFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
    { name: 'language-filter', component: filterComponents.LanguageFilter },
  ],
  'programs-collection': [
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
  ],
  'events-friends-gatherings': [
    { name: 'date-filter', component: filterComponents.DateFilter },
    { name: 'language-filter', component: filterComponents.LanguageFilter },
  ],
  'events-meals': [
    { name: 'date-filter', component: filterComponents.DateFilter },
    { name: 'language-filter', component: filterComponents.LanguageFilter },
  ],
  'publications-articles': [
    { name: 'collections-filter', component: filterComponents.CollectionsFilter },
    { name: 'publishers-filter', component: filterComponents.PublishersFilter },
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
    { name: 'language-filter', component: filterComponents.LanguageFilter },
  ],
  'publications-collection': [
    { name: 'date-filter', component: filterComponents.DateFilter },
  ],
  'publications-audio-blog': [
    { name: 'date-filter', component: filterComponents.DateFilter },
    { name: 'language-filter', component: filterComponents.LanguageFilter },
  ]
};

const UnitListPage = props => {
  const
    {
      namespace,
      items = [],
      wip = false,
      err = null,
      pageNo,
      total,
      pageSize,
      t,
      onPageChange,
      onFiltersChanged,
      onFiltersHydrated,
      renderUnit
    } = props;

  const content = WipErr({ wip, err, t }) || (
    <div>
      <div className="px-4 ">
        <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
        {
          items.length > 0 &&
          <table className="w-full index" >
            <tbody>
              {items.map(x => renderUnit(x, t, namespace))}
            </tbody>
          </table>
        }
      </div>
      <hr className="m-0 border-t" />
      <Pagination
        pageNo={pageNo}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
      />
    </div>
  );

  const nsFilters = filters[namespace] || [];

  return (
    <div className="unit-list">
      <hr className="m-0 border-t" />
      {
        nsFilters.length > 0 &&
        <Filters
          namespace={namespace}
          filters={nsFilters}
          onChange={onFiltersChanged}
          onHydrated={onFiltersHydrated}
        />
      }
      {content}
    </div>
  );
};

UnitListPage.propTypes = {
  namespace: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(shapes.ContentUnit),
  wip: shapes.WIP,
  err: shapes.Error,
  pageNo: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onFiltersChanged: PropTypes.func.isRequired,
  onFiltersHydrated: PropTypes.func.isRequired,
  renderUnit: PropTypes.func.isRequired,
};

export default UnitListPage;

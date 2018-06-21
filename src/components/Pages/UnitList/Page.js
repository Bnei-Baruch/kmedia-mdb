import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Divider, Table } from 'semantic-ui-react';

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
  ],
  'lessons-virtual': [
    { name: 'collections-filter', component: filterComponents.CollectionsFilter },
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'date-filter', component: filterComponents.DateFilter }
  ],
  'lessons-lectures': [
    { name: 'collections-filter', component: filterComponents.CollectionsFilter },
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'date-filter', component: filterComponents.DateFilter }
  ],
  'lessons-women': [
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'date-filter', component: filterComponents.DateFilter }
  ],
  'lessons-children': [
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'date-filter', component: filterComponents.DateFilter }
  ],
  'lessons-collection': [
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
  ],
  programs: [
    { name: 'programs-filter', component: filterComponents.ProgramsFilter },
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
  ],
  'programs-collection': [
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
  ],
  'events-friends-gatherings': [
    { name: 'date-filter', component: filterComponents.DateFilter }
  ],
  'events-meals': [
    { name: 'date-filter', component: filterComponents.DateFilter }
  ],
  publications: [
    { name: 'publishers-filter', component: filterComponents.PublishersFilter },
    { name: 'date-filter', component: filterComponents.DateFilter }
  ],
  'publications-collection': [
    { name: 'date-filter', component: filterComponents.DateFilter }
  ],
};

class UnitListPage extends PureComponent {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(shapes.ContentUnit),
    wip: shapes.WIP,
    err: shapes.Error,
    pageNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onFiltersChanged: PropTypes.func.isRequired,
    onFiltersHydrated: PropTypes.func.isRequired,
    renderUnit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
  };

  render() {
    const
      {
        namespace,
        items,
        wip,
        err,
        pageNo,
        total,
        pageSize,
        language,
        t,
        onPageChange,
        onFiltersChanged,
        onFiltersHydrated,
        renderUnit
      } = this.props;

    const content = WipErr({ wip, err, t }) || (
      <div>
        <Container className="padded">
          <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t} />
          {
            items.length > 0 ?
              <Table unstackable basic="very" className="index" sortable>
                <Table.Body>
                  {items.map(x => renderUnit(x, t))}
                </Table.Body>
              </Table> :
              null
          }
        </Container>
        <Divider fitted />
        <Container className="padded pagination-wrapper" textAlign="center">
          <Pagination
            pageNo={pageNo}
            pageSize={pageSize}
            total={total}
            language={language}
            onChange={onPageChange}
          />
        </Container>
      </div>
    );

    const nsFilters = filters[namespace] || [];

    return (
      <div className="unit-list">
        <Divider fitted />
        {
          nsFilters.length > 0 ?
            <Filters
              namespace={namespace}
              filters={nsFilters}
              onChange={onFiltersChanged}
              onHydrated={onFiltersHydrated}
            /> :
            null
        }
        {content}
      </div>
    );
  }
}

export default translate()(UnitListPage);

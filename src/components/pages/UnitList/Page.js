import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Divider, Table } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, LoadingSplash } from '../../shared/Splash';
import Pagination from '../../pagination/Pagination';
import ResultsPageHeader from '../../pagination/ResultsPageHeader';
import Filters from '../../Filters/Filters';
import filterComponents from '../../Filters/components';

const filters = {
  'programs': [
    { name: 'programs-filter', component: filterComponents.ProgramsFilter },
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
  ],
  'programs-collection': [
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
  ],
  'lectures': [
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
  ],
  'lectures-collection': [
    { name: 'topics-filter', component: filterComponents.TopicsFilter },
    { name: 'sources-filter', component: filterComponents.SourcesFilter },
    { name: 'date-filter', component: filterComponents.DateFilter },
  ],
  'events-friends-gatherings': [
    { name: 'date-filter', component: filterComponents.DateFilter }
  ],
  'events-meals': [
    { name: 'date-filter', component: filterComponents.DateFilter }
  ],
  'publications': [
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
    filters: PropTypes.arrayOf(shapes.filterPropShape),
    onPageChange: PropTypes.func.isRequired,
    onFiltersChanged: PropTypes.func.isRequired,
    onFiltersHydrated: PropTypes.func.isRequired,
    renderUnit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
    filters: [],
  };

  render() {
    const {
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

    let content;

    if (err) {
      content = <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    } else if (wip) {
      content = <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else {
      content = (
        <div>
          <Container className="padded">
            <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t} />
            {
              items.length > 0 ?
                <Table sortable basic="very" className="index-list">
                  <Table.Body>
                    {items.map(x => renderUnit(x, t))}
                  </Table.Body>
                </Table> :
                null
            }
          </Container>
          <Divider fitted />
          <Container className="padded" textAlign="center">
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
    }

    const nsFilters = filters[namespace] || [];

    return (
      <div>
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

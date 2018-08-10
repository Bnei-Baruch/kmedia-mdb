import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Divider } from 'semantic-ui-react';

import * as shapes from '../../../../shapes';
import Pagination from '../../../../Pagination/Pagination';
import ResultsPageHeader from '../../../../Pagination/ResultsPageHeader';
import Filters from '../../../../Filters/Filters';
import filterComponents from '../../../../Filters/components/index';
import WipErr from '../../../../shared/WipErr/WipErr';
import Feed from './Feed';

const filters = [
  { name: 'date-filter', component: filterComponents.DateFilter },
];

class TwitterPage extends PureComponent {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(shapes.Tweet),
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
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
  };

  render() {
    const
      {
        items,
        wip,
        err,
        pageNo,
        total,
        pageSize,
        namespace,
        language,
        t,
        onPageChange,
        onFiltersChanged,
        onFiltersHydrated,
      } = this.props;

    const content = WipErr({ wip, err, t }) || (
      <div>
        <Container className="padded">
          <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t} />
          {
            items.length > 0 ?
              <Feed tweets={items} t={t} /> :
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

    return (
      <div>
        <Divider fitted />
        <Filters
          namespace={namespace}
          filters={filters}
          onChange={onFiltersChanged}
          onHydrated={onFiltersHydrated}
        />
        {content}
      </div>
    );
  }
}

export default translate()(TwitterPage);

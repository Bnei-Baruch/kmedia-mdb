import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Container, Divider, Feed } from 'semantic-ui-react';

import * as shapes from '../../../../shapes';
import Pagination from '../../../../Pagination/Pagination';
import ResultsPageHeader from '../../../../Pagination/ResultsPageHeader';
import Filters from '../../../../Filters/Filters';
import filterComponents from '../../../../Filters/components/index';
import WipErr from '../../../../shared/WipErr/WipErr';
import TwitterFeed from './Feed';

const filters = [
  { name: 'date-filter', component: filterComponents.DateFilter },
];

const renderTwitters = (tweets, limitLength) => {
  const length = limitLength || tweets.length;

  return (
    <Feed className="publications-twitter">
      {
        tweets.slice(0, length).map(item => <TwitterFeed twitter={item} key={item.twitter_id} />)
      }
    </Feed>
  );
};

const TwitterPage = ({
  items = [],
  wip = false,
  err = null,
  limitLength,
  pageNo,
  total,
  pageSize,
  namespace,
  t,
  onPageChange,
  onFiltersChanged,
  onFiltersHydrated
}) => {
  const content = WipErr({ wip, err, t }) || (
    <div>
      <Container className="padded">
        <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
        {
          items.length > 0
            ? renderTwitters(items, limitLength)
            : null
        }
      </Container>
      <Divider fitted />
      <Container className="padded pagination-wrapper" textAlign="center">
        <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          total={total}
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
};

TwitterPage.propTypes = {
  namespace: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(shapes.Tweet),
  wip: shapes.WIP,
  err: shapes.Error,
  pageNo: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onFiltersChanged: PropTypes.func.isRequired,
  onFiltersHydrated: PropTypes.func.isRequired,
};

export default withTranslation()(TwitterPage);

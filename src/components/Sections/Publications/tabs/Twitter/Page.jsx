import PropTypes from 'prop-types';

import * as shapes from '../../../../shapes';
import Pagination from '../../../../Pagination/Pagination';
import ResultsPageHeader from '../../../../Pagination/ResultsPageHeader';
import FilterLabels from '../../../../FiltersAside/FilterLabels';
import { getWipErr } from '../../../../shared/WipErr/WipErr';
import TwitterFeed from './Feed';

const renderTwitters = (tweets, limitLength) => {
  const length = limitLength || tweets.length;
  return (
    <div className="publications-twitter">
      {tweets.slice(0, length).map(item => <TwitterFeed twitter={item} key={item.twitter_id} />)}
    </div>
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
  onPageChange,
}) => (
  <div>
    <div className="px-4">
      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
      <FilterLabels namespace={namespace} />
      {getWipErr(wip, err) || (items.length > 0 ? renderTwitters(items, limitLength) : null)}
    </div>
    <hr className="m-0" />
    <Pagination
      pageNo={pageNo}
      pageSize={pageSize}
      total={total}
      onChange={onPageChange}
    />
  </div>
);

TwitterPage.propTypes = {
  namespace: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(shapes.Tweet),
  wip: shapes.WIP,
  err: shapes.Error,
  pageNo: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  limitLength: PropTypes.number,
};

export default TwitterPage;

import React from 'react';
import PropTypes from 'prop-types';

import * as shapes from '../../../../shapes';
import Pagination from '../../../../Pagination/Pagination';
import ResultsPageHeader from '../../../../Pagination/ResultsPageHeader';
import FilterLabels from '../../../../FiltersAside/FilterLabels';
import Helmets from '../../../../shared/Helmets/index';
import { getWipErr } from '../../../../shared/WipErr/WipErr';
import Feed from './Feed';

const BlogPage = ({
  items = [],
  wip = false,
  err = null,
  pageNo,
  total,
  pageSize,
  namespace,
  onPageChange,
}) => (
  <div>
    <Helmets.NoIndex />
    <div className="px-4">
      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
      <FilterLabels namespace={namespace} />
      {getWipErr(wip, err) || (items.length > 0 ? <Feed items={items} /> : null)}
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

BlogPage.propTypes = {
  namespace: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(shapes.BlogPost),
  wip: shapes.WIP,
  err: shapes.Error,
  pageNo: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default BlogPage;

import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import * as shapes from '../../../../shapes';
import Pagination from '../../../../Pagination/Pagination';
import ResultsPageHeader from '../../../../Pagination/ResultsPageHeader';
import Filters from '../../../../Filters/Filters';
import filterComponents from '../../../../Filters/components/index';
import Helmets from '../../../../shared/Helmets/index';
import WipErr from '../../../../shared/WipErr/WipErr';
import Feed from './Feed';

const filters = [
  { name: 'date-filter', component: filterComponents.DateFilter },
];

const BlogPage = ({
  items = [],
  wip = false,
  err = null,
  pageNo,
  total,
  pageSize,
  namespace,
  t,
  onPageChange,
  onFiltersChanged,
  onFiltersHydrated,
}) => {
  const content = WipErr({ wip, err, t }) || (
    <div>
      <div className=" px-4 ">
        <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
        {
          items.length > 0
            ? <Feed items={items} />
            : null
        }
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

  return (
    <div>
      <Helmets.NoIndex />
      <hr className="m-0" />
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

BlogPage.propTypes = {
  namespace: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(shapes.BlogPost),
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

export default withTranslation()(BlogPage);

import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

const ResultsPageHeader = (props) => {
  const { pageNo, pageSize, total } = props;

  if (total === 0) {
    return <Header as="h2" content="No results" />;
  }

  if (total <= pageSize) {
    return <Header as="h2">Results 1 - {total} of {total}</Header>;
  }

  return (
    <Header as="h2">
      Results {((pageNo - 1) * pageSize) + 1} - {Math.min(total, pageNo * pageSize)}&nbsp;
      of {total}
    </Header>
  );
};

ResultsPageHeader.propTypes = {
  pageNo: PropTypes.number,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number,
};

ResultsPageHeader.defaultProps = {
  pageNo: 1,
  total: 0,
};

export default ResultsPageHeader;

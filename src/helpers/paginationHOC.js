/* eslint-disable react/prefer-stateless-function,arrow-body-style,react/no-multi-comp */
import React from 'react';
import ResultsPageHeader from '../components/shared/ResultsPageHeader';

const getPageNo = (search) => {
  let page = 0;
  if (search) {
    const match = search.match(/page=(\d+)/);
    if (match) {
      page = parseInt(match[1], 10);
    }
  }

  return (isNaN(page) || page <= 0) ? 1 : page;
};

const askForData = ({ fetchList, pageNo, language, pageSize, contentTypes }) => {
  fetchList(pageNo, language, pageSize, contentTypes);
};

const handlePageChange = (pageNo, props) => {
  const { setPage } = props;
  setPage(pageNo);
  const data = {
    ...props,
    pageNo // props includes _previous_ page number
  };
  askForData(data);
};

const resultsPageHeader = props => (
  <ResultsPageHeader {...props} />
);

const withPagination = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const newProps = {
        getPageNo,
        askForData,
        handlePageChange,
        resultsPageHeader
      };
      return <WrappedComponent  {...this.props} {...newProps} />;
    }
  };
};

export default withPagination;

import React from 'react';
import PropTypes from 'prop-types';

import * as shapes from '../shapes';

import Pagination from './Pagination';
import ResultsPageHeader from './ResultsPageHeader';

class withPagination extends React.Component {
  static propTypes = {
    pageNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
    location: shapes.HistoryLocation.isRequired,
    language: PropTypes.string.isRequired,
    fetchList: PropTypes.func.isRequired,
    contentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.string,
  };

  static defaultProps = {
    id: null,
  };

  static mapState = (namespace, state, selectors, settings) => ({
    pageNo: selectors.getPageNo(state[namespace]),
    total: selectors.getTotal(state[namespace]),
    pageSize: settings.getPageSize(state.settings),
  });

  static Pagination = props => (
    <Pagination {...props} onChange={x => withPagination.handlePageChange(props, x)} />
  );

  static ResultsPageHeader = props => (
    <ResultsPageHeader {...props} />
  );

  static getPageNo = (props) => {
    const { location: { search } } = props;
    let page                       = 0;
    if (search) {
      const match = search.match(/page=(\d+)/);
      if (match) {
        page = parseInt(match[1], 10);
      }
    }

    return (isNaN(page) || page <= 0) ? 1 : page;
  };

  static askForData = (props) => {
    const { fetchList, pageNo = withPagination.getPageNo(props), language, pageSize, contentTypes, id } = props;
    fetchList({
      pageNo,
      language,
      pageSize,
      contentTypes,
      id,
    });
  };

  static handlePageChange = (props, pageNo = withPagination.getPageNo(props)) => {
    const { setPage } = props;
    setPage(pageNo);
    const data = {
      ...props,
      pageNo // props includes _previous_ page number
    };
    withPagination.askForData(data);
  };

  componentWillReceiveProps(nextProps) {
    const { pageSize } = nextProps;

    if (pageSize !== this.props.pageSize) {
      withPagination.handlePageChange(nextProps, 1);
    }
  }

}

export default withPagination;

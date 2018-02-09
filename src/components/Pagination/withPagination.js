import React from 'react';
import PropTypes from 'prop-types';

import { getQuery } from '../../helpers/url';

class withPagination extends React.Component {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.pageSize !== this.props.pageSize) {
      this.setPage(nextProps, 1);
    }
    else if (nextProps.language !== this.props.language ||
             nextProps.namespace !== this.props.namespace) {
        this.askForData(nextProps);
    }
  }

  setPage(props, pageNo) {
    props.setPage(props.namespace, pageNo || props.pageNo);
    this.askForData(props, pageNo);
  };

  askForData(props, page, params = {}) {
    const { namespace, fetchList, pageNo, pageSize } = props;
    fetchList(namespace, page || pageNo, { ...params, ...this.extraFetchParams(), pageSize });
  };

  extraFetchParams() {
    return {};
  }

  getPageFromLocation(location) {
    const q = getQuery(location);
    const p = q.page ? parseInt(q.page, 10) : 1;
    return isNaN(p) || p <= 0 ? 1 : p;
  };

}

export default withPagination;

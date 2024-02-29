import React from 'react';
import PropTypes from 'prop-types';

import { getQuery } from '../../helpers/url';
import * as shapes from '../shapes';

export const getPageFromLocation = location => {
  const q = getQuery(location);
  const p = q.page ? Number.parseInt(q.page, 10) : 1;
  return Number.isNaN(p) || p <= 0 ? 1 : p;
};

class withPagination extends React.Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    location: shapes.HistoryLocation.isRequired,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const contentLanguages = (this.props.contentLanguages || []).slice().sort().join('-');
    const nextContentLanguages = (nextProps.contentLanguages || []).slice().sort().join('-');
    if (contentLanguages !== nextContentLanguages || nextProps.namespace !== this.props.namespace) {
      this.askForData(nextProps);
    }

    if (nextProps.pageSize !== this.props.pageSize) {
      this.setPage(nextProps, 1);
    }
  }

  setPage(props, pageNo) {
    props.setPage(props.namespace, pageNo || props.pageNo);
    this.askForData(props, pageNo);
  }

  askForData(props, page) {
    const { namespace, fetchList, pageNo, pageSize } = props;
    const params = { ...this.extraFetchParams(props), pageSize };
    fetchList(namespace, page || pageNo, params);
  }

  extraFetchParams() {
    // this is overridden in subclasses. Try not to modify...
    return {};
  }
}

export default withPagination;

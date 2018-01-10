import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { CT_FRIENDS_GATHERING, CT_MEAL } from '../../../../helpers/consts';
import { getQuery } from '../../../../helpers/url';
import { selectors as settings } from '../../../../redux/modules/settings';
import { selectors as filters } from '../../../../redux/modules/filters';
import { actions as listsActions, selectors as lists } from '../../../../redux/modules/lists';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import * as shapes from '../../../shapes';
import Page from './Page';

class UnitListContainer extends Component {

  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    tabName: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(shapes.ContentUnit),
    wip: shapes.WIP,
    err: shapes.Error,
    pageNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    isFiltersHydrated: PropTypes.bool,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
    isFiltersHydrated: false,
  };

  componentDidMount() {
    // If filters are already hydrated, handleFiltersHydrated won't be called.
    // We'll have to ask for data here instead.
    if (this.props.isFiltersHydrated) {
      this.askForData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.language !== this.props.language ||
      nextProps.tabName !== this.props.tabName) {
      this.askForData(nextProps);
    }

    if (nextProps.pageSize !== this.props.pageSize) {
      const { tabName, setPage } = nextProps;
      setPage(`events-${tabName}`, 1);
      this.askForData(nextProps, 1);
    }
  }

  askForData = (props, pn) => {
    const { tabName, fetchList, pageSize, pageNo } = props;
    fetchList(`events-${tabName}`, pn || pageNo, {
      pageSize,
      content_type: tabName === 'meals' ? CT_MEAL : CT_FRIENDS_GATHERING
    });
  };

  handlePageChanged = (pageNo) => {
    // withPagination.handlePageChange(this.props, pageNo);
    const { tabName, setPage } = this.props;
    setPage(`events-${tabName}`, pageNo);
    this.askForData(this.props, pageNo);
  };

  handleFiltersChanged = () => {
    // withPagination.handlePageChange(this.props, 1);
    this.handlePageChanged(1);
  };

  handleFiltersHydrated = () => {
    // withPagination.handlePageChange(this.props);

    const { location, pageNo } = this.props;
    let p                      = pageNo;

    const q = getQuery(location);
    if (q.page) {
      const pn = parseInt(q.page, 10);
      if (!isNaN(pn) && pn !== pageNo) {
        p = pn;
      }
    }
    this.handlePageChanged(p);
  };

  render() {
    const { tabName, items, wip, err, pageNo, total, pageSize, language } = this.props;

    return (
      <Page
        tabName={tabName}
        items={items}
        wip={wip}
        err={err}
        pageNo={pageNo}
        total={total}
        pageSize={pageSize}
        language={language}
        onPageChange={this.handlePageChanged}
        onFiltersChanged={this.handleFiltersChanged}
        onFiltersHydrated={this.handleFiltersHydrated}
      />
    );
  }
}

const mapState = (state, ownProps) => {
  const { tabName } = ownProps;
  const namespace   = `events-${tabName}`;
  const nsState     = lists.getNamespaceState(state.lists, namespace);

  return {
    items: (nsState.items || []).map(x => mdb.getDenormContentUnit(state.mdb, x)),
    wip: nsState.wip,
    err: nsState.err,
    pageNo: nsState.pageNo,
    total: nsState.total,
    pageSize: settings.getPageSize(state.settings),
    language: settings.getLanguage(state.settings),
    isFiltersHydrated: filters.getIsHydrated(state.filters, namespace),
  };
};

const mapDispatch = dispatch => (
  bindActionCreators({
    fetchList: listsActions.fetchList,
    setPage: listsActions.setPage,
  }, dispatch)
);

export default connect(mapState, mapDispatch)(UnitListContainer);

import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import { actions as filtersActions, selectors as filters } from '../../../redux/modules/filters';
import { actions as listsActions, selectors as lists } from '../../../redux/modules/lists';
import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice/mdbSlice';
import withPagination, { getPageFromLocation } from '../../Pagination/withPagination';
import * as shapes from '../../shapes';
import Page from './Page';
import { withRouter } from '../../../helpers/withRouterPatch';

export class UnitListContainer extends withPagination {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    location: shapes.HistoryLocation.isRequired,
    items: PropTypes.arrayOf(shapes.ContentUnit),
    wip: shapes.WIP,
    err: shapes.Error,
    pageNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    isFiltersHydrated: PropTypes.bool,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    extraFetchParams: PropTypes.object,
    renderUnit: PropTypes.func.isRequired,
    resetNamespace: PropTypes.func.isRequired
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
    isFiltersHydrated: false,
    extraFetchParams: {},
  };

  constructor(props) {
    super(props);
    this.handlePageChanged     = this.handlePageChanged.bind(this);
    this.handleFiltersChanged  = this.handleFiltersChanged.bind(this);
    this.handleFiltersHydrated = this.handleFiltersHydrated.bind(this);
  }

  // Edo: not sure why we may get into such state
  // that filters are already hydrated on didMount.
  // Anyway, now with SSR. It's for sure that isFiltersHydrated is true.
  // but we don't want to askForData. Server did that part for us...
  // Note: found out one such possible flow (collection page):
  // mount -> unmount -> mount again

  // componentDidMount() {
  //   // If filters are already hydrated, handleFiltersHydrated won't be called.
  //   // We'll have to ask for data here instead.
  //   if (this.props.isFiltersHydrated) {
  //     this.askForData(this.props);
  //   }
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // clear all filters when location's search is cleared by Menu click
    if (nextProps.location.search !== this.props.location.search) {
      if (!nextProps.location.search) {
        nextProps.resetNamespace(nextProps.namespace);
        this.handleFiltersChanged();
      } else {
        const pageNo = getPageFromLocation(nextProps.location);

        if (pageNo !== nextProps.pageNo) {
          this.setPage(nextProps, pageNo);
        }
      }
    }

    super.UNSAFE_componentWillReceiveProps(nextProps);
  }

  extraFetchParams() {
    return this.props.extraFetchParams;
  }

  handlePageChanged(pageNo) {
    // We probably don't need this because <ScrollToTop /> is in <App />
    // In any case, we shouldn't have this null checking
    // if (typeof window !== 'undefined') {
    //   window.scrollTo(0, 0);
    // }
    this.setPage(this.props, pageNo);
  }

  handleFiltersChanged(pageNo) {
    this.handlePageChanged(pageNo || 1);
  }

  handleFiltersHydrated(location) {
    const p = getPageFromLocation(location);
    this.handlePageChanged(p);
  }

  render() {
    const { namespace, items, wip, err, pageNo, total, pageSize, renderUnit, location } = this.props;

    return (
      <Page
        namespace={namespace}
        items={items}
        wip={wip}
        err={err}
        pageNo={pageNo}
        total={total}
        pageSize={pageSize}
        renderUnit={renderUnit}
        onPageChange={this.handlePageChanged}
        onFiltersChanged={this.handleFiltersChanged}
        onFiltersHydrated={() => this.handleFiltersHydrated(location)}
      />
    );
  }
}

export const mapState = (state, ownProps) => {
  const { namespace } = ownProps;
  const nsState       = lists.getNamespaceState(state.lists, namespace);

  return {
    namespace,
    items: (nsState.items || []).map(x => mdb.getDenormContentUnit(state.mdb, x)),
    wip: nsState.wip,
    err: nsState.err,
    pageNo: nsState.pageNo,
    total: nsState.total,
    pageSize: settings.getPageSize(state.settings),
    isFiltersHydrated: filters.getIsHydrated(state.filters, namespace),
  };
};

export const mapDispatch = dispatch => (
  bindActionCreators({
    fetchList: listsActions.fetchList,
    setPage: listsActions.setPage,
    resetNamespace: filtersActions.resetNamespace,
    hydrateFilters: filtersActions.hydrateFilters,
  }, dispatch)
);

export const wrap = (WrappedComponent, ms = mapState, md = mapDispatch) => withRouter(connect(ms, md)(WrappedComponent));

export default wrap(UnitListContainer);

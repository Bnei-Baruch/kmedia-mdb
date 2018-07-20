import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, LANG_UKRAINIAN } from '../../../helpers/consts';
import { selectors as settings } from '../../../redux/modules/settings';
import { actions as filtersActions, selectors as filters } from '../../../redux/modules/filters';
import { actions, selectors } from '../../../redux/modules/twitter';
import withPagination from '../../Pagination/withPagination';
import * as shapes from '../../shapes';
import Page from './Page';

class TwitterContainer extends withPagination {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    items: PropTypes.arrayOf(shapes.Tweet),
    wip: shapes.WIP,
    err: shapes.Error,
    pageNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    isFiltersHydrated: PropTypes.bool,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    resetNamespace: PropTypes.func.isRequired
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
    isFiltersHydrated: false,
  };

  constructor() {
    super();
    this.handlePageChanged     = this.handlePageChanged.bind(this);
    this.handleFiltersChanged  = this.handleFiltersChanged.bind(this);
    this.handleFiltersHydrated = this.handleFiltersHydrated.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // clear all filters when location's search is cleared by Menu click
    if (nextProps.location.search !== this.props.location.search &&
      !nextProps.location.search) {
      nextProps.resetNamespace('twitter');
      this.handleFiltersChanged();
    }

    super.componentWillReceiveProps(nextProps);
  }

  // eslint-disable-next-line class-methods-use-this
  extraFetchParams(props) {
    switch (props.language) {
    case LANG_HEBREW:
      return { username: 'laitman_co_il' };
    case LANG_UKRAINIAN:
    case LANG_RUSSIAN:
      return { username: 'Michael_Laitman' };
    case LANG_SPANISH:
      return { username: 'laitman_es' };
    default:
      return { username: 'laitman' };
    }
  }

  handlePageChanged(pageNo) {
    window.scrollTo(0, 0);
    this.setPage(this.props, pageNo);
  }

  handleFiltersChanged() {
    this.handlePageChanged(1);
  }

  handleFiltersHydrated() {
    const p = withPagination.getPageFromLocation(this.props.location);
    this.handlePageChanged(p);
  }

  render() {
    const { items, wip, err, pageNo, total, pageSize, language } = this.props;

    return (
      <Page
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

export const mapState = state => ({
  items: selectors.getTweets(state.twitter),
  total: selectors.getTotal(state.twitter),
  wip: selectors.getWip(state.twitter),
  err: selectors.getError(state.twitter),
  pageNo: selectors.getPageNo(state.twitter),
  pageSize: settings.getPageSize(state.settings),
  language: settings.getLanguage(state.settings),
  isFiltersHydrated: filters.getIsHydrated(state.filters, 'twitter'),
});

export const mapDispatch = dispatch => (
  bindActionCreators({
    fetchList: actions.fetchData,
    setPage: actions.setPage,
    resetNamespace: filtersActions.resetNamespace,
  }, dispatch)
);

export default withRouter(connect(mapState, mapDispatch)(TwitterContainer));

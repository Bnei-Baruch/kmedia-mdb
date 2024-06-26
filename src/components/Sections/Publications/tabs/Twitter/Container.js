import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from '@reduxjs/toolkit';
import { connect } from 'react-redux';

import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, LANG_UKRAINIAN } from '../../../../../helpers/consts';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { actions as filtersActions, selectors as filters } from '../../../../../redux/modules/filters';
import { actions, selectors } from '../../../../../redux/modules/publications';
import withPagination, { getPageFromLocation } from '../../../../Pagination/withPagination';
import * as shapes from '../../../../shapes';
import Page from './Page';
import { withRouter } from '../../../../../helpers/withRouterPatch';
import { settingsGetContentLanguagesSelector } from '../../../../../redux/selectors';

class TwitterContainer extends withPagination {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    location: shapes.HistoryLocation.isRequired,
    items: PropTypes.arrayOf(shapes.Tweet),
    wip: shapes.WIP,
    err: shapes.Error,
    pageNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    contentLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
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

  constructor(props) {
    super(props);
    this.handlePageChanged     = this.handlePageChanged.bind(this);
    this.handleFiltersChanged  = this.handleFiltersChanged.bind(this);
    this.handleFiltersHydrated = this.handleFiltersHydrated.bind(this);
  }

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

  // Map all content languages to proper Twitter usernames.
  extraFetchParams({ contentLanguages }) {
    const usernames = contentLanguages.map(language => {
      switch (language) {
        case LANG_HEBREW:
          return 'laitman_co_il';
        case LANG_UKRAINIAN:
        case LANG_RUSSIAN:
          return 'Michael_Laitman';
        case LANG_SPANISH:
          return 'laitman_es';
        case LANG_ENGLISH:
          return 'laitman';

        default:
          return null;
      }
    }).filter(username => !!username);
    if (!usernames.length) {
      usernames.push('laitman');
    }

    return { username: usernames };
  }

  handlePageChanged(pageNo) {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    this.setPage(this.props, pageNo);
  }

  handleFiltersChanged() {
    this.handlePageChanged(1);
  }

  handleFiltersHydrated(location) {
    const p = getPageFromLocation(location);
    this.handlePageChanged(p);
  }

  render() {
    const { items, wip, err, pageNo, total, pageSize, namespace, location } = this.props;

    return (
      <Page
        namespace={namespace}
        items={items}
        wip={wip}
        err={err}
        pageNo={pageNo}
        total={total}
        pageSize={pageSize}
        onPageChange={this.handlePageChanged}
        onFiltersChanged={this.handleFiltersChanged}
        onFiltersHydrated={() => this.handleFiltersHydrated(location)}
      />
    );
  }
}

export const mapState = (state, ownProps) => ({
  items: selectors.getTweets(state.publications),
  total: selectors.getTweetsTotal(state.publications),
  wip: selectors.getTweetsWip(state.publications),
  err: selectors.getTweetsError(state.publications),
  pageNo: selectors.getTweetsPageNo(state.publications),
  pageSize: settings.getPageSize(state.settings),
  contentLanguages: settingsGetContentLanguagesSelector(state),
  isFiltersHydrated: filters.getIsHydrated(state.filters, ownProps.namespace),
});

export const mapDispatch = dispatch => (
  bindActionCreators({
    fetchList: actions.fetchTweets,
    setPage: actions.setPage,
    resetNamespace: filtersActions.resetNamespace,
  }, dispatch)
);

export default withRouter(connect(mapState, mapDispatch)(TwitterContainer));

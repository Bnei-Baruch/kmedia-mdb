import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, LANG_UKRAINIAN } from '../../../../../helpers/consts';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { actions as filtersActions, selectors as filters } from '../../../../../redux/modules/filters';
import { actions, selectors } from '../../../../../redux/modules/publications';
import withPagination from '../../../../Pagination/withPagination';
import * as shapes from '../../../../shapes';
import Page from './Page';

class BlogContainer extends withPagination {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    location: shapes.HistoryLocation.isRequired,
    items: PropTypes.arrayOf(shapes.BlogPost),
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
    if (nextProps.location.search !== this.props.location.search) {
      if (!nextProps.location.search) {
        nextProps.resetNamespace(nextProps.namespace);
        this.handleFiltersChanged();
      } else {
        const pageNo = withPagination.getPageFromLocation(nextProps.location);
        if (pageNo !== nextProps.pageNo) {
          this.setPage(nextProps, pageNo);
        }
      }
    }

    super.componentWillReceiveProps(nextProps);
  }

  extraFetchParams({ language }) {
    switch (language) {
    case LANG_HEBREW:
      return { blog: 'laitman-co-il' };
    case LANG_UKRAINIAN:
    case LANG_RUSSIAN:
      return { blog: 'laitman-ru' };
    case LANG_SPANISH:
      return { blog: 'laitman-es' };
    default:
      return { blog: 'laitman-com' };
    }
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

  handleFiltersHydrated() {
    const p = withPagination.getPageFromLocation(this.props.location);
    this.handlePageChanged(p);
  }

  render() {
    const { items, wip, err, pageNo, total, pageSize, language, namespace } = this.props;

    return (
      <Page
        namespace={namespace}
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

export const mapState = (state, ownProps) => ({
  items: selectors.getBlogPosts(state.publications),
  total: selectors.getBlogTotal(state.publications),
  wip: selectors.getBlogWip(state.publications),
  err: selectors.getBlogError(state.publications),
  pageNo: selectors.getBlogPageNo(state.publications),
  pageSize: settings.getPageSize(state.settings),
  language: settings.getLanguage(state.settings),
  isFiltersHydrated: filters.getIsHydrated(state.filters, ownProps.namespace),
});

export const mapDispatch = dispatch => (
  bindActionCreators({
    fetchList: actions.fetchBlogList,
    setPage: actions.setPage,
    resetNamespace: filtersActions.resetNamespace,
  }, dispatch)
);

export default withRouter(connect(mapState, mapDispatch)(BlogContainer));

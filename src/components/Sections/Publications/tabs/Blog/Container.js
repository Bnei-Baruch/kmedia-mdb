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
import { settingsGetContentLanguagesSelector } from '../../../../../redux/selectors';

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

  componenDidUpdate(nextProps) {
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

    super.componenDidUpdate(nextProps);
  }

  // Map all content languages to proper blogs.
  extraFetchParams({ contentLanguages }) {
    const blogs = contentLanguages.map(language => {
      switch (language) {
        case LANG_HEBREW:
          return 'laitman-co-il';
        case LANG_UKRAINIAN:
        case LANG_RUSSIAN:
          return 'laitman-ru';
        case LANG_SPANISH:
          return 'laitman-es';
        case LANG_ENGLISH:
          return 'laitman-com';

        default:
          return null;
      }
    }).filter(blog => !!blog);
    if (!blogs.length) {
      blogs.push('laitman-com');
    }

    return { blog: blogs };
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
  items: selectors.getBlogPosts(state.publications),
  total: selectors.getBlogTotal(state.publications),
  wip: selectors.getBlogWip(state.publications),
  err: selectors.getBlogError(state.publications),
  pageNo: selectors.getBlogPageNo(state.publications),
  pageSize: settings.getPageSize(state.settings),
  contentLanguages: settingsGetContentLanguagesSelector(state),
  isFiltersHydrated: filters.getIsHydrated(state.filters, ownProps.namespace),
});

export const mapDispatch = dispatch => (
  bindActionCreators({
    fetchList: actions.fetchBlogList,
    setPage: actions.setPage,
    resetNamespace: filtersActions.resetNamespace,
  }, dispatch)
);

export default connect(mapState, mapDispatch)(BlogContainer);

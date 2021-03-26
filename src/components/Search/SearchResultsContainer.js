import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react';

import { actions, selectors } from '../../redux/modules/search';
import { selectors as settingsSelectors } from '../../redux/modules/settings';
import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import { selectors as publicationSelectors } from '../../redux/modules/publications';
import { BLOGS } from '../../helpers/consts';
import * as shapes from '../shapes';
import SectionHeader from '../shared/SectionHeader';
import SearchResults from './SearchResults';
import Filters from './Filters';

class SearchResultsContainer extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    queryResult: PropTypes.shape({
      intents: PropTypes.arrayOf(PropTypes.shape({
        language: PropTypes.string,
        type: PropTypes.string,
        value: PropTypes.shape({}),
      })),
      search_result: PropTypes.shape({})
    }),
    cMap: PropTypes.objectOf(shapes.Collection).isRequired,
    cuMap: PropTypes.objectOf(shapes.ContentUnit).isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
    search: PropTypes.func.isRequired,
    updateQuery: PropTypes.func.isRequired,
    click: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    sortBy: PropTypes.string.isRequired,
    deb: PropTypes.bool.isRequired,
    hydrateUrl: PropTypes.func.isRequired,
    setSortBy: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    location: shapes.HistoryLocation.isRequired,
    postMap: PropTypes.objectOf(PropTypes.shape({
      blog: PropTypes.string,
      content: PropTypes.string,
      created_at: PropTypes.string,
      title: PropTypes.string,
      url: PropTypes.string,
      wp_id: PropTypes.number,
    })).isRequired,
  };

  static defaultProps = {
    queryResult: null,
    wip: false,
    err: null,
  };

  componentDidMount() {
    this.props.hydrateUrl();
  }

  componentDidUpdate(prevProps) {
    const { pageNo, language } = this.props;

    if (prevProps.language !== language) {
      this.callSearch(pageNo);
    }
  }

  componentWillUnmount() {
    this.props.updateQuery(''); // reset query for next page
  }

  callSearch = (pageNo = 1) => {
    const { search, query, pageSize, deb } = this.props;
    search(query, pageNo, pageSize, '' /* suggest */, deb);
  };

  handlePageChange = (pageNo) => {
    const { setPage } = this.props;
    setPage(pageNo);
    this.callSearch(pageNo);
  };

  handleSortByChanged = (e, data) => {
    const { setSortBy, pageNo } = this.props;
    setSortBy(data.value);
    this.callSearch(pageNo);
  };

  handleFiltersChanged = () => {
    this.handlePageChange(1);
  };

  handleFiltersHydrated = () => {
    const { pageNo } = this.props;
    this.callSearch(pageNo);
  };

  render() {
    const {
      wip,
      err,
      queryResult,
      cMap,
      cuMap,
      postMap,
      twitterMap,
      pageNo,
      pageSize,
      sortBy,
      language,
      location,
      click
    } = this.props;

    return (
      <div>
        <SectionHeader section="search" />
        <Filters
          sortBy={sortBy}
          onChange={this.handleFiltersChanged}
          onSortByChange={this.handleSortByChanged}
          onHydrated={this.handleFiltersHydrated}
          location={location}
        />
        <Container className="padded">
          <SearchResults
            queryResult={queryResult}
            cMap={cMap}
            cuMap={cuMap}
            postMap={postMap}
            twitterMap={twitterMap}
            wip={wip}
            err={err}
            pageNo={pageNo}
            pageSize={pageSize}
            language={language}
            handlePageChange={this.handlePageChange}
            location={location}
            click={click}
          />
        </Container>
      </div>
    );
  }
}

const cuMapFromState = (state, results) => (
  results && results.hits && Array.isArray(results.hits.hits)
    ? results.hits.hits.reduce((acc, val) => {
      if (val._source.result_type === 'units') {
        const cuID = val._source.mdb_uid;
        const cu   = mdbSelectors.getDenormContentUnit(state.mdb, cuID);
        if (cu) {
          acc[cuID] = cu;
        }
      }
      return acc;
    }, {})
    : {}
);

const cMapFromState = (state, results) => (
  results && results.hits && Array.isArray(results.hits.hits)
    ? results.hits.hits.reduce((acc, val) => {
      if (val._source.result_type === 'collections') {
        const cID = val._source.mdb_uid;
        const c   = mdbSelectors.getDenormCollection(state.mdb, cID);
        if (c && c.content_units?.length) {
          acc[cID] = c;
        }
      }
      return acc;
    }, {})
    : {}
);

const postMapFromState = (state, results) => (
  results && results.hits && Array.isArray(results.hits.hits)
    ? results.hits.hits.reduce((acc, val) => {
      if (val._source.result_type === 'posts') {
        const ids     = val._source.mdb_uid.split('-');
        const blogObj = BLOGS.find(b => b.id === parseInt(ids[0], 10));
        const p       = publicationSelectors.getBlogPost(state.publications, blogObj.name, ids[1]);
        if (p) {
          acc[val._source.mdb_uid] = p;
        }
      }
      return acc;
    }, {})
    : {}
);

const mapState = (state) => {
  const queryResult = selectors.getQueryResult(state.search);
  const results     = queryResult.search_result;

  return {
    queryResult,
    cMap: cMapFromState(state, results),
    cuMap: cuMapFromState(state, results),
    postMap: postMapFromState(state, results),
    query: selectors.getQuery(state.search),
    pageNo: selectors.getPageNo(state.search),
    sortBy: selectors.getSortBy(state.search),
    deb: selectors.getDeb(state.search),
    pageSize: settingsSelectors.getPageSize(state.settings),
    language: settingsSelectors.getLanguage(state.settings),
    wip: selectors.getWip(state.search),
    err: selectors.getError(state.search),
  };
};

const mapDispatch = dispatch => bindActionCreators({
  search: actions.search,
  updateQuery: actions.updateQuery,
  click: actions.click,
  setPage: actions.setPage,
  setSortBy: actions.setSortBy,
  hydrateUrl: actions.hydrateUrl,
}, dispatch);

export default connect(mapState, mapDispatch)(SearchResultsContainer);

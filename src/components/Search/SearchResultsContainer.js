import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Divider } from 'semantic-ui-react';

import { actions, selectors } from '../../redux/modules/search';
import { selectors as settingsSelectors } from '../../redux/modules/settings';
import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import * as shapes from '../shapes';
import SectionHeader from '../shared/SectionHeader';
import SearchResults from './SearchResults';
import Filters from './Filters';

class SearchResultsContainer extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    results: PropTypes.object,
    cMap: PropTypes.objectOf(shapes.Collection).isRequired,
    cuMap: PropTypes.objectOf(shapes.ContentUnit).isRequired,
    sMap: PropTypes.objectOf(shapes.ContentUnit).isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
    search: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    sortBy: PropTypes.string.isRequired,
    deb: PropTypes.bool.isRequired,
    hydrateUrl: PropTypes.func.isRequired,
    setSortBy: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    location: shapes.HistoryLocation.isRequired,
  };

  static defaultProps = {
    results: null,
    wip: false,
    err: null,
  };

  componentDidMount() {
    this.props.hydrateUrl();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.language !== this.props.language) {
      const { search, query, pageSize, pageNo, deb } = this.props;
      search(query, pageNo, pageSize, deb);
    }
  }

  handlePageChange = (pageNo) => {
    const { setPage, search, query, pageSize, deb } = this.props;
    setPage(pageNo);
    search(query, pageNo, pageSize, deb);
  };

  handleSortByChanged = (e, data) => {
    const { setSortBy, search, query, pageSize, pageNo, deb } = this.props;
    setSortBy(data.value);
    search(query, pageNo, pageSize, deb);
  };

  handleFiltersChanged = () => {
    this.handlePageChange(1);
  };

  handleFiltersHydrated = () => {
    const { search, query, pageSize, pageNo, deb } = this.props;
    search(query, pageNo, pageSize, deb);
  };

  render() {
    const { wip, err, results, cMap, cuMap, sMap, pageNo, pageSize, sortBy, language, location } = this.props;

    return (
      <div>
        <SectionHeader section="search" />
        <Divider fitted />
        <Filters
          sortBy={sortBy}
          onChange={this.handleFiltersChanged}
          onSortByChange={this.handleSortByChanged}
          onHydrated={this.handleFiltersHydrated}
        />
        <Container className="padded">
          <SearchResults
            results={results}
            cMap={cMap}
            cuMap={cuMap}
            sMap={sMap}
            wip={wip}
            err={err}
            pageNo={pageNo}
            pageSize={pageSize}
            language={language}
            handlePageChange={this.handlePageChange}
            location={location}
          />
        </Container>
      </div>
    );
  }
}

const mapState = (state) => {
  const results = selectors.getResults(state.search);

  const cMap = results && results.hits && Array.isArray(results.hits.hits) ?
    results.hits.hits.reduce((acc, val) => {
      if (val._type === 'collections') {
        const cID = val._source.mdb_uid;
        const c   = mdbSelectors.getDenormCollection(state.mdb, cID);
        if (c) {
          acc[cID] = c;
        }
      }
      return acc;
    }, {}) :
    {};

  const cuMap = results && results.hits && Array.isArray(results.hits.hits) ?
    results.hits.hits.reduce((acc, val) => {
      if (val._type === 'content_units') {
        const cuID = val._source.mdb_uid;
        const cu   = mdbSelectors.getDenormContentUnit(state.mdb, cuID);
        if (cu) {
          acc[cuID] = cu;
        }
      }
      return acc;
    }, {}) :
    {};

  const sMap = results && results.hits && Array.isArray(results.hits.hits) ?
    results.hits.hits.reduce((acc, val) => {
      if (val._type === 'sources') {
        const sID = val._source.mdb_uid;
        const s   = mdbSelectors.getDenormSource(state.mdb, sID);
        console.log(s)
        if (s) {
          acc[sID] = s;
        }
      }
      return acc;
    }, {}) :
    {};

  return {
    results,
    cMap,
    cuMap,
    sMap,
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
  setPage: actions.setPage,
  setSortBy: actions.setSortBy,
  hydrateUrl: actions.hydrateUrl,
}, dispatch);

export default connect(mapState, mapDispatch)(SearchResultsContainer);

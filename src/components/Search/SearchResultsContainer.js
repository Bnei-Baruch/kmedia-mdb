import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react';

import { actions, selectors } from '../../redux/modules/search';
import { selectors as settingsSelectors } from '../../redux/modules/settings';
import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import * as shapes from '../shapes';
import SearchResults from './SearchResults';
import Filters from './Filters';

class SearchResultsContainer extends Component {
  static propTypes = {
    query: PropTypes.string,
    results: PropTypes.object,
    cuMap: PropTypes.objectOf(shapes.ContentUnit),
    wip: shapes.WIP,
    err: shapes.Error,
    search: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    sortBy: PropTypes.string.isRequired,
    hydrateUrl: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
  };

  static defaultProps = {
    query: '',
    results: null,
    wip: false,
    err: null,
  };

  componentDidMount() {
    this.props.hydrateUrl();
  }

  handlePageChange = (pageNo) => {
    const { setPage, search, query, pageSize } = this.props;
    setPage(pageNo);
    search(query, pageNo, pageSize);
  };

  onSortByChange = (e, data) => {
    const { setSortBy, search, query, pageSize, pageNo } = this.props;
    setSortBy(data.value);
    search(query, pageNo, pageSize);
  };

  onSearch = () => {
    const { search, query, pageSize, pageNo } = this.props;
    search(query, pageNo, pageSize);
  };

  render() {
    const { wip, err, results, cuMap, pageNo, pageSize, sortBy, language } = this.props;

    return (
      <div>
        <Filters
          sortBy={sortBy}
          onChange={this.onSearch}
          onSortByChange={this.onSortByChange}
          onHydrated={() => this.handlePageChange(1)}
        />
        <Container className="padded">
          <SearchResults
            results={results}
            cuMap={cuMap}
            wip={wip}
            err={err}
            pageNo={pageNo}
            pageSize={pageSize}
            language={language}
            handlePageChange={this.handlePageChange}
          />
        </Container>
      </div>
    );
  }
}

const mapState = state => {
  const results = selectors.getResults(state.search);
  const cuMap   = results && results.hits && Array.isArray(results.hits.hits) ?
    results.hits.hits.reduce((acc, val) => {
      const cuID = val._source.mdb_uid;
      acc[cuID]  = mdbSelectors.getDenormContentUnit(state.mdb, cuID);
      return acc;
    }, {}) :
    {};

  return {
    results,
    cuMap,
    query: selectors.getQuery(state.search),
    pageNo: selectors.getPageNo(state.search),
    sortBy: selectors.getSortBy(state.search),
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

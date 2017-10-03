import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react';

import { selectors } from '../../redux/modules/search';
import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import * as shapes from '../shapes';
import SearchResults from './SearchResults';

class SearchResultsContainer extends Component {
  static propTypes = {
    query: PropTypes.string,
    results: PropTypes.object,
    cuMap: PropTypes.objectOf(shapes.ContentUnit),
    wip: shapes.WIP,
    err: shapes.Error,
  };

  static defaultProps = {
    query: '',
    results: null,
    wip: false,
    err: null,
  };

  render() {
    const { wip, err, query, results, cuMap } = this.props;

    return (
      <Container className="padded">
        <SearchResults results={results} cuMap={cuMap} query={query} wip={wip} err={err} />
      </Container>
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
    wip: selectors.getWip(state.search),
    err: selectors.getError(state.search),
  };
};

export default connect(mapState)(SearchResultsContainer);

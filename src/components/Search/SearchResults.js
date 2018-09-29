import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Divider, Grid } from 'semantic-ui-react';

import { isEmpty } from '../../helpers/utils';
import { getQuery } from '../../helpers/url';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import { filtersTransformer } from '../../filters';
import * as shapes from '../shapes';
import WipErr from '../shared/WipErr/WipErr';
import Pagination from '../Pagination/Pagination';
import ResultsPageHeader from '../Pagination/ResultsPageHeader';
import SearchResultCU from './SearchResultCU';
import SearchResultCollection from './SearchResultCollection';
import SearchResultIntent from './SearchResultIntent';
import SearchResultSource from './SearchResultSource';
import { SEARCH_INTENT_HIT_TYPES, } from '../../helpers/consts';

class SearchResults extends Component {
  static propTypes = {
    results: PropTypes.object,
    getSourcePath: PropTypes.func,
    areSourcesLoaded: PropTypes.bool.isRequired,
    queryResult: PropTypes.object,
    cMap: PropTypes.objectOf(shapes.Collection),
    cuMap: PropTypes.objectOf(shapes.ContentUnit),
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired,
    location: shapes.HistoryLocation.isRequired,
    click: PropTypes.func.isRequired,
  };

  static defaultProps = {
    queryResult: null,
    cMap: {},
    cuMap: {},
    wip: false,
    err: null,
    getSourcePath: undefined,
  };

  filterByHitType = (hit) => {
    const { hitType } = this.props;
    return hitType ? hit.type === hitType : true;
  };

  renderHit = (hit, rank) => {
    const { cMap, cuMap }                                                        = this.props;
    const { _source: { mdb_uid: mdbUid, result_type: resultType }, _type: type } = hit;

    const props = { ...this.props, hit, rank, key: `${mdbUid}_${type}` };

    if (SEARCH_INTENT_HIT_TYPES.includes(type)) {
      return <SearchResultIntent  {...props} />;
    }

    const cu = cuMap[mdbUid];
    const c  = cMap[mdbUid];

    if (cu) {
      return <SearchResultCU   {...props} cu={cu} />;
    } else if (c) {
      return <SearchResultCollection c={c}  {...props} />;
    } else if (resultType === 'sources') {
      return <SearchResultSource   {...props} />;
    }

    // maybe content_units are still loading ?
    // maybe stale data in elasticsearch ?
    return null;
  };

  render() {
    const {
            filters,
            wip,
            err,
            queryResult,
            areSourcesLoaded,
            pageNo,
            pageSize,
            language,
            t,
            handlePageChange,
            location,
          } = this.props;

    const { search_result: results } = queryResult;

    const wipErr = WipErr({ wip: wip || !areSourcesLoaded, err, t });
    if (wipErr) {
      return wipErr;
    }

    // Query from URL (not changed until pressed Enter.
    const query = getQuery(location).q;

    if (query === '' && !Object.values(filtersTransformer.toApiParams(filters)).length) {
      return <div>{t('search.results.empty-query')}</div>;
    }

    if (isEmpty(results)) {
      return null;
    }

    const { /* took, */ hits: { total, hits } } = results;
    // Elastic too slow and might fails on more than 1k results.
    const totalForPagination                    = Math.min(1000, total);

    let content;
    if (total === 0) {
      content = (
        <Trans i18nKey="search.results.no-results">
          Your search for <strong style={{ fontStyle: 'italic' }}>{{ query }}</strong> found no results.
        </Trans>
      );
    } else {
      content = (
        <Grid>
          <Grid.Column key="1" width={12}>
            <div className="searchResult_content">
              <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t} />
              {hits.filter(this.filterByHitType).map(this.renderHit)}
            </div>
            <Divider fitted />
            <Container className="padded pagination-wrapper" textAlign="center">
              <Pagination
                pageNo={pageNo}
                pageSize={pageSize}
                total={totalForPagination}
                language={language}
                onChange={handlePageChange}
              />
            </Container>
          </Grid.Column>
          <Grid.Column key="2" width={4} />
        </Grid>);
    }
    return content;
  }
}

export default connect(state => ({
  filters: filterSelectors.getFilters(state.filters, 'search'),
  areSourcesLoaded: sourcesSelectors.areSourcesLoaded(state.sources),
  getSourcePath: sourcesSelectors.getPathByID(state.sources),
  getSourceById: sourcesSelectors.getSourceById(state.sources),
  getTagById: tagsSelectors.getTagById(state.tags),
}))(translate()(SearchResults));


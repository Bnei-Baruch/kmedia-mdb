import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Divider, Label, Table } from 'semantic-ui-react';

import {  isEmpty } from '../../helpers/utils';
import { getQuery, isDebMode } from '../../helpers/url';
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
import {  SEARCH_INTENT_HIT_TYPES,} from '../../helpers/consts';

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

  // Helper function to get the frist prop in hightlights obj and apply htmlFunc on it.
  snippetFromHighlight = (highlight, props, htmlFunc) => {
    const prop = props.find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);
    // eslint-disable-next-line react/no-danger
    return !prop ? null : <span dangerouslySetInnerHTML={{ __html: htmlFunc(highlight[prop]) }} />;
  };

  click = (mdb_uid, index, type, rank, searchId) => {
    const { click } = this.props;
    click(mdb_uid, index, type, rank, searchId);
  };

  filterByHitType = (hit) => {
    const { hitType } = this.props;
    return hitType ? hit.type === hitType : true;
  };

  renderHit = (hit, rank) => {
    const { cMap, cuMap }                                                           = this.props;
    const { _source: { mdb_uid: mdbUid, result_type: resultType }, _type: hitType } = hit;

    if (SEARCH_INTENT_HIT_TYPES.includes(hitType)) {
      return (
        <Table.Row key={`${mdbUid}_intent`} verticalAlign="top">
          <Table.Cell colSpan="5">
            <SearchResultIntent hit={hit} rank={rank} {...this.props} />
          </Table.Cell>
        </Table.Row>
      );
    }

    const cu = cuMap[mdbUid];
    const c  = cMap[mdbUid];

    if (cu) {
      return (
        <Table.Row key={`${mdbUid}_cu`} verticalAlign="top">
          <Table.Cell colSpan="4">
            <SearchResultCU hit={hit} rank={rank} {...this.props} cu={cu} />
          </Table.Cell>
        </Table.Row>
      );
    } else if (c) {
      return (
        <Table.Row key={`${mdbUid}_collection`} verticalAlign="top">
          <Table.Cell colSpan="4">
            <SearchResultCollection hit={hit} rank={rank} c={c} snippetFromHighlight={this.snippetFromHighlight}  {...this.props} />
          </Table.Cell>
        </Table.Row>
      );
    } else if (resultType === 'sources') {
      return (<Table.Row key={`${mdbUid}_sources`} verticalAlign="top">
        <Table.Cell colSpan="5">
          <SearchResultSource hit={hit} {...this.props} snippetFromHighlight={this.snippetFromHighlight} />
        </Table.Cell>
      </Table.Row>);
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
        <div>
          <Container>
            <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t} />
            <Table sortable basic="very" className="index-list search-results">
              <Table.Body>
                {hits.filter(this.filterByHitType).map(this.renderHit)}
              </Table.Body>
            </Table>
          </Container>
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
        </div>);
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


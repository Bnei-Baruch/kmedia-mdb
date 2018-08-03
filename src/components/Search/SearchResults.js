import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Divider, Label, Table } from 'semantic-ui-react';

import { canonicalLink, sectionLink } from '../../helpers/links';
import { formatDuration, isEmpty, tracePath } from '../../helpers/utils';
import { getQuery, isDebMode } from '../../helpers/url';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import { filtersTransformer } from '../../filters';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import WipErr from '../shared/WipErr/WipErr';
import Pagination from '../Pagination/Pagination';
import ResultsPageHeader from '../Pagination/ResultsPageHeader';
import ScoreDebug from './ScoreDebug';
import SearchResultCU from './SearchResultCU';
import SearchResultIntent from './SearchResultIntent';
import {
  SEARCH_INTENT_FILTER_NAMES,
  SEARCH_INTENT_NAMES,
  SEARCH_INTENT_SECTIONS,
  SEARCH_INTENT_INDEX_TOPIC,
  SEARCH_INTENT_INDEX_SOURCE,
  SEARCH_INTENT_HIT_TYPES,
} from '../../helpers/consts';

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

  renderCollection = (c, hit, rank) => {
    const { t, location, queryResult }                                                           = this.props;
    const { search_result: { searchId } }                                                        = queryResult;
    const { _index: index, _type: type, _source: { mdb_uid: mdbUid }, highlight, _score: score } = hit;

    const name        = this.snippetFromHighlight(highlight, ['name', 'name_analyzed'], parts => parts.join(' ')) || c.name;
    const description = this.snippetFromHighlight(highlight, ['description', 'description_analyzed'], parts => `...${parts.join('.....')}...`);
    const snippet     = (
      <div className="search__snippet">
        {
          description ?
            <div>
              <strong>{t('search.result.description')}: </strong>
              {description}
            </div> :
            null
        }
      </div>);

    let startDate = '';
    if (c.start_date) {
      startDate = t('values.date', { date: c.start_date });
    }

    return (
      <Table.Row key={mdbUid} verticalAlign="top">
        <Table.Cell collapsing singleLine width={1}>
          <strong>{startDate}</strong>
        </Table.Cell>
        <Table.Cell collapsing singleLine>
          <Label size="tiny">{t(`constants.content-types.${c.content_type}`)}</Label>
        </Table.Cell>
        <Table.Cell>
          <Link
            className="search__link"
            onClick={() => this.click(mdbUid, index, type, rank, searchId)}
            to={canonicalLink(c || { id: mdbUid, content_type: c.content_type })}
          >
            {name}
          </Link>
          &nbsp;&nbsp;
          {snippet || null}
        </Table.Cell>
        {
          !isDebMode(location) ? null :
            <Table.Cell collapsing textAlign="right">
              <ScoreDebug name={c.name} score={score} explanation={hit._explanation} />
            </Table.Cell>
        }
      </Table.Row>
    );
  };

  renderSource = (hit) => {
    const { t, location, getSourcePath }                             = this.props;
    const { _source: { mdb_uid: mdbUid }, highlight, _score: score } = hit;

    const srcPath = getSourcePath(mdbUid);

    const name = this.snippetFromHighlight(highlight, ['name', 'name_analyzed'], parts => parts.join(' ')) || srcPath[srcPath.length - 1].name;

    const authors = this.snippetFromHighlight(highlight, ['authors', 'authors_analyzed'], parts => parts[0]);
    if (authors) {
      // Remove author from path in order to replace with highlight value.
      srcPath.pop();
    }

    const path = `${srcPath.slice(0, -1).map(n => n.name).join(' > ')} >`;

    const description = this.snippetFromHighlight(highlight, ['description', 'description_analyzed'], parts => `...${parts.join('.....')}...`);
    const content     = this.snippetFromHighlight(highlight, ['content', 'content_analyzed'], parts => `...${parts.join('.....')}...`);
    const snippet     = (
      <div className="search__snippet">
        {
          description ?
            <div>
              <strong>{t('search.result.description')}: </strong>
              {description}
            </div> :
            null
        }
        {
          content ?
            <div>
              <strong>{t('search.result.content')}: </strong>
              {content}
            </div> :
            null
        }
      </div>);

    return (
      <Table.Row key={mdbUid} verticalAlign="top">
        <Table.Cell collapsing singleLine width={1}>
          <strong>&nbsp;&nbsp;&nbsp;&nbsp;</strong>
        </Table.Cell>
        <Table.Cell collapsing singleLine>
          <Label size="tiny">{t('filters.sections-filter.sources')}</Label>
        </Table.Cell>
        <Table.Cell>
          <Link className="search__link" to={canonicalLink({ id: mdbUid, content_type: 'SOURCE' })}>
            {authors}&nbsp;{path}&nbsp;{name}
          </Link>
          {snippet || null}
        </Table.Cell>
        {
          !isDebMode(location) ?
            null :
            <Table.Cell collapsing textAlign="right">
              <ScoreDebug name={srcPath[srcPath.length - 1].name} score={score} explanation={hit._explanation} />
            </Table.Cell>
        }
      </Table.Row>
    );
  };

  renderHit = (hit, rank) => {
    // console.log('hit', hit);
    const { cMap, cuMap }                                  = this.props;
    const { _source: { mdb_uid: mdbUid, content_type: contentType }, _type: hitType } = hit;
    const cu                                               = cuMap[mdbUid];
    const c                                                = cMap[mdbUid];

    console.log('SearchResult.render mdbUid:', mdbUid);
    if (cu) {
      return (
        <Table.Row key={`${mdbUid}_${contentType}`} verticalAlign="top">
          <Table.Cell colSpan="4">
            <SearchResultCU hit={hit} rank={rank} {...this.props} cu={cu} />
          </Table.Cell>
        </Table.Row>
      );
    } else if (c) {
      return this.renderCollection(c, hit, rank);
    } else if (hitType === 'sources') {
      return this.renderSource(hit, rank);
    } else if (SEARCH_INTENT_HIT_TYPES.includes(hitType)) {
      return (
        <Table.Row key={`${mdbUid}_${contentType}`} verticalAlign="top">
          <Table.Cell colSpan="5">
            <SearchResultIntent hit={hit} rank={rank} {...this.props} />
          </Table.Cell>
        </Table.Row>
      );
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


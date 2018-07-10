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
  };

  // Helper function to get the frist prop in hightlights obj and apply htmlFunc on it.
  snippetFromHighlight = (highlight, props, htmlFunc) => {
    const prop = props.find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);
    // eslint-disable-next-line react/no-danger
    return !prop ? null : <span dangerouslySetInnerHTML={{ __html: htmlFunc(highlight[prop]) }} />;
  };

  resultClick = (mdb_uid, index, resultType, rank, searchId) => {
    const { click } = this.props;
    click(mdb_uid, index, resultType, rank, searchId);
  };

  renderResult = (hit, rank, result) => {
    const { t, location, queryResult } = this.props;
    const { search_result: { searchId } } = queryResult;
    const {
      _index: index,
      _source: { mdb_uid: mdbUid, result_type: resultType },
      highlight,
      _score: score
    } = hit;
    const { title, description, content, label, content_type, date, duration } = result;

    const snippetHtml = (
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
              <strong>{t('search.result.transcript')}: </strong>
              {content}
            </div> :
            null
        }
      </div>);

    let dateText = '';
    if (date) {
      dateText = t('values.date', { date });
    }

    const durationHtml = duration ? <small>{formatDuration(duration)}</small> : null;

    return (
      <Table.Row key={mdbUid} verticalAlign="top">
        <Table.Cell collapsing singleLine width={1}>
          <strong>{dateText}</strong>
        </Table.Cell>
        <Table.Cell collapsing singleLine>
          <Label size="tiny">{t(label)}</Label>
        </Table.Cell>
        <Table.Cell>
          <Link
            className="search__link"
            onClick={() => this.resultClick(mdbUid, index, resultType, rank, searchId)}
            to={canonicalLink({ id: mdbUid, content_type })}
          >
            {title}
          </Link>
          &nbsp;&nbsp;
          {durationHtml || null}
          {snippetHtml || null}
        </Table.Cell>
        {
          !isDebMode(location) ?
            null :
            <Table.Cell collapsing textAlign="right">
              <ScoreDebug name={title} score={score} explanation={hit._explanation} />
            </Table.Cell>
        }
      </Table.Row>
    );
  };

  renderIntent = (hit, rank) => {
    const { t, location, queryResult, getTagById, getSourceById} = this.props;
    const { search_result: { searchId } } = queryResult;
    const {
      _index: index,
      _type: type,
      _source: {
        content_type: contentType,
        mdb_uid: mdbUid,
        name,
        explanation,
        score: originalScore,
        max_explanation: maxExplanation,
        max_score: maxScore
      },
      _score: score,
    } = hit;
    const section    = SEARCH_INTENT_SECTIONS[type];
    const intentType = SEARCH_INTENT_NAMES[index];
    const filterName = SEARCH_INTENT_FILTER_NAMES[index];

    let getFilterById = null;
    switch (index) {
    case SEARCH_INTENT_INDEX_TOPIC:
      getFilterById = getTagById;
      break;
    case SEARCH_INTENT_INDEX_SOURCE:
      getFilterById = getSourceById;
      break;
    default:
      getFilterById = x => x;
    }

    const path  = tracePath(getFilterById(mdbUid), getFilterById);
    let display = '';
    switch (index) {
    case SEARCH_INTENT_INDEX_TOPIC:
      display = path[path.length - 1].label;
      break;
    case SEARCH_INTENT_INDEX_SOURCE:
      display = path.map(y => y.name).join(' > ');
      break;
    default:
      display = name;
    }

    return (
      <Table.Row key={mdbUid + contentType} verticalAlign="top">
        <Table.Cell collapsing singleLine width={1}>
          {/*<strong>date if applicable</strong>*/}
        </Table.Cell>
        <Table.Cell collapsing singleLine>
          <Label size="tiny">{t(`search.intent-types.${section}`)}</Label>
        </Table.Cell>
        <Table.Cell>
          <Link
            className="search__link"
            onClick={() => this.resultClick(mdbUid, index, type, rank, searchId)}
            to={sectionLink(section, [{name: filterName, value: mdbUid, getFilterById}])}
          >
            {t(`search.intent-prefix.${section}-${intentType.toLowerCase()}`)} {display}
          </Link>
        </Table.Cell>
        {
          !isDebMode(location) ?
            null :
            <Table.Cell collapsing textAlign="right">
              <div style={{ display: 'inline-block' }}>
                <ScoreDebug
                  name={`${name} (${originalScore})`}
                  score={score}
                  explanation={explanation}
                />
              </div>
              <div style={{ display: 'inline-block' }}>
                <ScoreDebug
                  name="Max"
                  score={maxScore}
                  explanation={maxExplanation}
                />
              </div>
            </Table.Cell>
        }
      </Table.Row>
    );
  };

  renderHit = (hit, rank) => {
    const {
      _source: { mdb_uid: mdbUid,  result_type: resultType },
      _type: hitType,
      highlight,
    } = hit;

    if (SEARCH_INTENT_HIT_TYPES.includes(hitType)) {
      return this.renderIntent(hit, rank)
    }

    const { cMap, cuMap } = this.props;
    const cu = cuMap[mdbUid];
    const c = cMap[mdbUid];
    const result = {
      title: this.snippetFromHighlight(highlight, ['title', 'title_language'], parts => parts.join(' ')),
      description: this.snippetFromHighlight(highlight, ['description', 'description_language'], parts => `...${parts.join('.....')}...`),
      content: this.snippetFromHighlight(highlight, ['content', 'content_language'], parts => `...${parts.join('.....')}...`),
      content_type: '',
      label: '',
      date: null,
      duration: null,
    };
    if (cu) {
      if (!result.title) {
        result.title = cu.name;
      }
      result.content_type = cu.content_type;
      result.label = `constants.content-types.${cu.content_type}`
      result.date = cu.film_date;
      result.duration = cu.duration;
    } else if (c) {
      if (!result.title) {
        result.title = c.name;
      }
      result.content_type = c.content_type;
      result.label = `constants.content-types.${c.content_type}`
    } else if (resultType === 'sources') {
      if (!result.title) {
        result.title = hit._source.title;
      }
      result.content_type = 'SOURCE';
      result.label = 'filters.sections-filter.sources';
    }

    return this.renderResult(hit, rank, result);
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
    const totalForPagination = Math.min(1000, total);

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
                {hits.map(this.renderHit)}
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
  getSourceById: sourcesSelectors.getSourceById(state.sources),
  getTagById: tagsSelectors.getTagById(state.tags),
}))(translate()(SearchResults));


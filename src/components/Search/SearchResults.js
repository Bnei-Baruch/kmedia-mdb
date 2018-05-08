import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Divider, Label, Table } from 'semantic-ui-react';

import { canonicalLink, sectionLink } from '../../helpers/links';
import { tracePath, formatDuration, isEmpty } from '../../helpers/utils';
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
  SEARCH_I_FILTER_NAMES,
  SEARCH_I_NAMES,
  SEARCH_I_SOURCE,
  SEARCH_I_TOPIC,
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
  }

  renderContentUnit = (cu, hit, rank) => {
    const { t, location, queryResult } = this.props;
    const { search_result: { searchId } } = queryResult;
    const { _index: index, _type: type, _source: { mdb_uid: mdbUid }, highlight, _score: score } = hit;

    const name        = this.snippetFromHighlight(highlight, ['name', 'name_analyzed'], parts => parts.join(' ')) || cu.name;
    const description = this.snippetFromHighlight(highlight, ['description', 'description_analyzed'], parts => `...${parts.join('.....')}...`);
    const transcript  = this.snippetFromHighlight(highlight, ['transcript', 'transcript_analyzed'], parts => `...${parts.join('.....')}...`);
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
          transcript ?
            <div>
              <strong>{t('search.result.transcript')}: </strong>
              {transcript}
            </div> :
            null
        }
      </div>);

    let filmDate = '';
    if (cu.film_date) {
      filmDate = t('values.date', { date: new Date(cu.film_date) });
    }

    return (
      <Table.Row key={mdbUid} verticalAlign="top">
        <Table.Cell collapsing singleLine width={1}>
          <strong>{filmDate}</strong>
        </Table.Cell>
        <Table.Cell collapsing singleLine>
          <Label size="tiny">{t(`constants.content-types.${cu.content_type}`)}</Label>
        </Table.Cell>
        <Table.Cell>
          <Link
            className="search__link"
            onClick={() => this.click(mdbUid, index, type, rank, searchId)}
            to={canonicalLink(cu || { id: mdbUid, content_type: cu.content_type })}
          >
            {name}
          </Link>
          &nbsp;&nbsp;
          {
            cu.duration ?
              <small>{formatDuration(cu.duration)}</small> :
              null
          }
          {snippet || null}
        </Table.Cell>
        {
          !isDebMode(location) ?
            null :
            <Table.Cell collapsing textAlign="right">
              <ScoreDebug name={cu.name} score={score} explanation={hit._explanation} />
            </Table.Cell>
        }
      </Table.Row>
    );
  };

  renderCollection = (c, hit, rank) => {
    const { t, location, queryResult } = this.props;
    const { search_result: { searchId } } = queryResult;
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
      startDate = t('values.date', { date: new Date(c.start_date) });
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
    const { t, location, getSourcePath } = this.props;
    const { _source: { mdb_uid: mdbUid }, highlight, _score: score } = hit;

    const srcPath = getSourcePath(mdbUid)

    const name = this.snippetFromHighlight(highlight, ['name', 'name_analyzed'], parts => parts.join(' ')) || srcPath[srcPath.length-1].name;
    let path="", authors="";

        authors = this.snippetFromHighlight(highlight, ['authors', 'authors_analyzed'], parts => parts[0]);
        if (authors){
          // Remove author from path in order to replace with highlight value.
          srcPath.pop();
        }
        path = srcPath.slice(0,-1).map(n => n.name).join(' > ') + ' >';

    const description = this.snippetFromHighlight(highlight, ['description', 'description_analyzed'], parts => `...${parts.join('.....')}...`);
    const content  = this.snippetFromHighlight(highlight, ['content', 'content_analyzed'], parts => `...${parts.join('.....')}...`);
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
          <Label size="tiny">{t(`filters.sections-filter.sources`)}</Label>
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
              <ScoreDebug name={srcPath[srcPath.length-1].name} score={score} explanation={hit._explanation} />
            </Table.Cell>
        }
      </Table.Row>
    );
  };

  renderHit = (hit, rank) => {
    // console.log('hit', hit);
    const { cMap, cuMap }            = this.props;
    const { _source: { mdb_uid: mdbUid }, _type: hitType } = hit;
    const cu                               = cuMap[mdbUid];
    const c                                = cMap[mdbUid];

    if (cu) {
      return this.renderContentUnit(cu, hit, rank);
    } else if (c) {
      return this.renderCollection(c, hit, rank);
    } else if (hitType === 'sources') {
      return this.renderSource(hit, rank);
    }

    // maybe content_units are still loading ?
    // maybe stale data in elasticsearch ?
    return null;
  };

  renderIntentLinks = (section, intents) => {
    const { t, getTagById, getSourceById } = this.props;
    const intentsData = intents.map(intent => {
      const intentType = SEARCH_I_NAMES[intent.type];
      const filterName = SEARCH_I_FILTER_NAMES[intent.type];
      let getFilterById = null;
      switch (intent.type) {
        case SEARCH_I_TOPIC:
          getFilterById = getTagById;
          break;
        case SEARCH_I_SOURCE:
          getFilterById = getSourceById
          break;
        default:
          getFilterById = (x) => x;
      }
      const path = tracePath(getFilterById(intent.value.mdb_uid), getFilterById);
      let display = '';
      switch (intent.type) {
        case SEARCH_I_TOPIC:
          display = path[path.length - 1].label;
          break;
        case SEARCH_I_SOURCE:
          display = path.map(y => y.name).join(' > ');
          break;
        default:
          display = intent.value.name;
      }
      return {intentType, name: filterName, value: intent.value.mdb_uid, getFilterById, display};
    });

    const compareIntentsData = (a, b) => {
      if (a.display === b.display) {
        return 0;
      }
      return a.display > b.display ? 1 : -1;
    };
    return intentsData.sort(compareIntentsData).map(data => {
      return (
        <Link
          key={data.value}
          className="search__link"
          style={{paddingLeft: "50px", display: "block"}} /* INLINE CSS, NEED CORRECTION */
          to={sectionLink(section, [data])}
        >
          {t(`search.intent-prefix.${data.intentType.toLowerCase()}`)} {data.display}
        </Link>
      );
    });
  };

  renderIntentsDeb = (intents) => {
    return (
      <Table.Row key="intents-debug" verticalAlign="top">
        <Table.Cell collapsing singleLine width={1}></Table.Cell>
        <Table.Cell collapsing singleLine></Table.Cell>
        <Table.Cell>
          <Table>
            <Table.Body>
            {intents.map(intent => {
              const intentType = SEARCH_I_NAMES[intent.type];
              return (
                <Table.Row key={intent.type + intent.value.mdb_uid}>
                  <Table.Cell>
                    {intent.value.name} {intentType} {intent.value.mdb_uid}
                  </Table.Cell>
                  <Table.Cell>
                    <div style={{display: 'inline-block'}}>
                      <ScoreDebug
                        name={intent.value.name}
                        score={intent.value.score}
                        explanation={intent.value.explanation} />
                    </div>
                    <div style={{display: 'inline-block'}}>
                      <ScoreDebug
                        name="Max"
                        score={intent.value.max_score}
                        explanation={intent.value.max_explanation} />
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
            </Table.Body>
          </Table>
        </Table.Cell>
      </Table.Row>
    );
  }

  renderIntents = (intents) => {
    const { t } = this.props;
    const sections = ['lessons', 'programs'];
    return sections.map(section => {
      const tagIntents = intents.filter(i => i.type === SEARCH_I_TOPIC);
      const sourceIntents = intents.filter(i => i.type === SEARCH_I_SOURCE);
      return (
        <Table.Row key={section} verticalAlign="top">
          <Table.Cell collapsing singleLine width={1}>
            {/*<strong>date if applicable</strong>*/}
          </Table.Cell>
          <Table.Cell collapsing singleLine>
            <Label size="tiny">{t(`search.intent-types.${section}`)}</Label>
          </Table.Cell>
          <Table.Cell>
            <div style={{display: "inline-block", verticalAlign: "top"}} /* INLINE CSS, NEED CORRECTION */ >
              {this.renderIntentLinks(section, tagIntents)}
            </div>
            <div style={{display: "inline-block", verticalAlign: "top"}} /* INLINE CSS, NEED CORRECTION */ >
              {this.renderIntentLinks(section, sourceIntents)}
            </div>
          </Table.Cell>
        </Table.Row>
      );
    });
  };

  render() {
    const { filters, wip, err, queryResult, areSourcesLoaded, pageNo, pageSize, language, t, handlePageChange, location } = this.props;
    const { search_result: results, intents = []} = queryResult;

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
                {isDebMode(location) ? this.renderIntentsDeb(intents) : null}
                {
                  // Dark launch intents, i.e., not show the user until quality is good enough.
                  // Remove isDebMode of following line when quality is good.
                }
                {isDebMode(location) && pageNo === 1 && intents.length ? this.renderIntents(intents) : null}
                {hits.map(this.renderHit)}
              </Table.Body>
            </Table>
          </Container>
          <Divider fitted />
          <Container className="padded" textAlign="center">
            <Pagination
              pageNo={pageNo}
              pageSize={pageSize}
              total={total}
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


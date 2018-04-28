import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Divider, Label, Table } from 'semantic-ui-react';

import { canonicalLink, formatDuration, isEmpty } from '../../helpers/utils';
import { getQuery, isDebMode } from '../../helpers/url';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { filtersTransformer } from '../../filters';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import WipErr from '../shared/WipErr/WipErr';
import Pagination from '../Pagination/Pagination';
import ResultsPageHeader from '../Pagination/ResultsPageHeader';
import ScoreDebug from './ScoreDebug';
import { constants } from 'os';

class SearchResults extends Component {
  static propTypes = {
    results: PropTypes.object,
    cMap: PropTypes.objectOf(shapes.Collection),
    cuMap: PropTypes.objectOf(shapes.ContentUnit),
    sMap: PropTypes.objectOf(shapes.Source),
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired,
    sources: PropTypes.arrayOf(PropTypes.object).isRequired,
    location: shapes.HistoryLocation.isRequired,
    click: PropTypes.func.isRequired,
  };

  static defaultProps = {
    results: null,
    cMap: {},
    cuMap: {},
    sMap: {},
    wip: false,
    err: null,
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

  renderContentUnit = (cu, hit, rank) => {
    const { t, location, results: { searchId } } = this.props;

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
      filmDate = t('values.date', { date: cu.film_date });
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
    const { t, location, results: { searchId } }                                                 = this.props;
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
          isDebMode(location) ?
            <Table.Cell collapsing textAlign="right">
              <ScoreDebug name={c.name} score={score} explanation={hit._explanation} />
            </Table.Cell> :
            null
        }
      </Table.Row>
    );
  };

  renderSource = (s, hit) => {
    const { t, location, sources }                                            = this.props;
    const { _source: { mdb_uid: mdbUid }, highlight, _score: score } = hit;

    const name = this.snippetFromHighlight(highlight, ['name', 'name.analyzed'], parts => parts.join(' ')) || s.name;
    let path="", authors="";

    if (sources) {
        const sourcesArr = sources(mdbUid);
        authors = this.snippetFromHighlight(highlight, ['authors', 'authors.analyzed'], parts => parts[0]);
        if (authors){
          // Remove author from path in order to replace with highlight value.
          sourcesArr.pop();
        }
        path = sourcesArr.slice(0,-1).map(n => n.name).join(' > ') + ' >';
    }

    const description = this.snippetFromHighlight(highlight, ['description', 'description.analyzed'], parts => `...${parts.join('.....')}...`);
    const content  = this.snippetFromHighlight(highlight, ['content', 'content.analyzed'], parts => `...${parts.join('.....')}...`);
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
              <ScoreDebug name={s.name} score={score} explanation={hit._explanation} />
            </Table.Cell>
        }
      </Table.Row>
    );
  };

  renderHit = (hit, rank) => {
    // console.log('hit', hit);
    const { cMap, cuMap, sMap }            = this.props;
    const { _source: { mdb_uid: mdbUid } } = hit;
    const cu                               = cuMap[mdbUid];
    const c                                = cMap[mdbUid];
    const s                                = sMap[mdbUid];

    if (cu) {
      return this.renderContentUnit(cu, hit, rank);
    } else if (c) {
      return this.renderCollection(c, hit, rank);
    } else if (s) {
      return this.renderSource(s, hit, rank);
    }

    // maybe content_units are still loading ?
    // maybe stale data in elasticsearch ?
    return null;
  };

  render() {
    const { filters, wip, err, results, pageNo, pageSize, language, t, handlePageChange, cMap, cuMap, sMap, location } = this.props;

    const wipErr = WipErr({ wip, err, t });
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
    if (total === 0 || (isEmpty(cMap) && isEmpty(cuMap) && isEmpty(sMap))) {
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
            <Table sortable basic="very" className="index-list">
              <Table.Body>
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
  sources: sourcesSelectors.getPathByID(state.sources)
}))(translate()(SearchResults));


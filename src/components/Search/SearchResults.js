import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Divider, Label, Table } from 'semantic-ui-react';

import { canonicalLink, formatDuration, isEmpty } from '../../helpers/utils';
import { getQuery } from '../../helpers/url';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { filtersTransformer } from '../../filters';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import Pagination from '../Pagination/Pagination';
import WipErr from '../shared/WipErr/WipErr';
import ResultsPageHeader from '../Pagination/ResultsPageHeader';

class SearchResults extends Component {
  static propTypes = {
    results: PropTypes.object,
    cMap: PropTypes.objectOf(shapes.Collection),
    cuMap: PropTypes.objectOf(shapes.ContentUnit),
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.object).isRequired,
    location: shapes.HistoryLocation.isRequired,
  };

  static defaultProps = {
    results: null,
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

  isDebMode = () => {
    const params = this.props.location.search.substring(1).split('&');
    return !!params.find((p) => {
      const pair = p.split('=');
      return decodeURIComponent(pair[0]) === 'deb';
    });
  };

  renderContentUnit = (cu, hit) => {
    const { t }                                                      = this.props;
    const { _source: { mdb_uid: mdbUid }, highlight, _score: score } = hit;

    const name        = this.snippetFromHighlight(highlight, ['name', 'name.analyzed'], parts => parts.join(' ')) || cu.name;
    const description = this.snippetFromHighlight(highlight, ['description', 'description.analyzed'], parts => `...${parts.join('.....')}...`);
    const transcript  = this.snippetFromHighlight(highlight, ['transcript', 'transcript.analyzed'], parts => `...${parts.join('.....')}...`);
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
          <Link className="search__link" to={canonicalLink(cu || { id: mdbUid, content_type: cu.content_type })}>
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
          !this.isDebMode() ?
            null :
            <Table.Cell collapsing textAlign="right">
              {score}
            </Table.Cell>
        }
      </Table.Row>
    );
  };

  renderCollection = (c, hit) => {
    const { t }                                                      = this.props;
    const { _source: { mdb_uid: mdbUid }, highlight, _score: score } = hit;

    const name        = this.snippetFromHighlight(highlight, ['name', 'name.analyzed'], parts => parts.join(' ')) || c.name;
    const description = this.snippetFromHighlight(highlight, ['description', 'description.analyzed'], parts => `...${parts.join('.....')}...`);
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
          <Link className="search__link" to={canonicalLink(c || { id: mdbUid, content_type: c.content_type })}>
            {name}
          </Link>
          &nbsp;&nbsp;
          {snippet || null}
        </Table.Cell>
        <Table.Cell collapsing textAlign="right">
          {score}
        </Table.Cell>
      </Table.Row>
    );
  };

  renderHit = (hit) => {
    // console.log('hit', hit);
    const { cMap, cuMap }                  = this.props;
    const { _source: { mdb_uid: mdbUid } } = hit;
    const cu                               = cuMap[mdbUid];
    const c                                = cMap[mdbUid];

    if (cu) {
      return this.renderContentUnit(cu, hit);
    } else if (c) {
      return this.renderCollection(c, hit);
    }

    // maybe content_units are still loading ?
    // maybe stale data in elasticsearch ?
    return null;
  };

  render() {
    const { filters, wip, err, results, pageNo, pageSize, language, t, handlePageChange, cMap, cuMap, location } = this.props;

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
    if (total === 0 || (isEmpty(cMap) && isEmpty(cuMap))) {
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
}))(translate()(SearchResults));


import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Trans, translate } from 'react-i18next';
import { Container, Divider, Header, Label, Table } from 'semantic-ui-react';

import { canonicalLink, formatError, isEmpty } from '../../helpers/utils';
import { getQuery } from '../../helpers/url';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { filtersTransformer } from '../../filters';
import * as shapes from '../shapes';
import { ErrorSplash, LoadingSplash } from '../shared/Splash';
import Link from '../Language/MultiLanguageLink';
import Pagination from '../pagination/Pagination';

class SearchResults extends Component {
  static propTypes = {
    results: PropTypes.object,
    cuMap: PropTypes.objectOf(shapes.ContentUnit),
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static defaultProps = {
    results: null,
    cuMap: {},
    wip: false,
    err: null,
  };

  // Helper function to get the frist prop in hightlights obj and apply htmlFunc on it.
  snippetFromHighlight = (highlight, props, htmlFunc) => {
    const prop = props.find(p => p in highlight && Array.isArray(highlight[p]) && highlight[p].length);
    return !prop ? null : <span dangerouslySetInnerHTML={{ __html: htmlFunc(highlight[prop])}}></span>;
  }

  renderHit = (hit) => {
    console.log('hit', hit);
    const { cuMap, t }                               = this.props;
    const { _source: { mdb_uid }, highlight, _score: score } = hit;
    const cu = cuMap[mdb_uid];

    const name = this.snippetFromHighlight(highlight, ['name', 'name.analyzed'], parts => parts.join(' ')) || cu.name;
    const description = this.snippetFromHighlight(highlight, ['description', 'description.analyzed'], parts => `...${parts.join('.....')}...`);
    const transcript = this.snippetFromHighlight(highlight, ['transcript', 'transcript.analyzed'], parts => `...${parts.join('.....')}...`);
    const snippet = (<span>
                       {!description ? null : (
                         <span>
                           <Label size="small">{t('search.result.description')}</Label>
                           {description}
                         </span>
                       )}
                       {!transcript ? null : (
                         <span>
                           <Label size="small">{t('search.result.transcript')}</Label>
                           {transcript}
                         </span>
                       )}
                     </span>)

    let filmDate = '';
    if (cu.film_date) {
      filmDate = t('values.date', { date: new Date(cu.film_date) });
    }

    return (
      <Table.Row key={mdb_uid} verticalAlign="top">
        <Table.Cell collapsing singleLine width={1}>
          <strong>{filmDate}</strong>
        </Table.Cell>
        <Table.Cell>
          <span>
          <Label>{t(`constants.content-types.${cu.content_type}`)}</Label>
          <Link to={canonicalLink(cu || { id: mdb_uid, content_type: cu.content_type })}>
            {name}
          </Link>
            &nbsp;&nbsp;
            {
              cu.duration ?
                <small>{moment.duration(cu.duration, 'seconds').format('hh:mm:ss')}</small> :
                null
            }
          </span>
          {snippet ? <div>{snippet}</div> : null}
        </Table.Cell>
        <Table.Cell collapsing textAlign="right">
          {score}
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { filters, wip, err, results, pageNo, pageSize, language, t, handlePageChange, cuMap } = this.props;

    // Query from URL (not changed until pressed Enter.
    const query = getQuery(window.location).q;

    if (err) {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }

    if (query === '' && !Object.values(filtersTransformer.toApiParams(filters)).length) {
      return (
        <div>
          {t('search.results.empty-query')}
        </div>
      );
    }

    if (isEmpty(results)) {
      return null;
    }

    const { took, hits: { total, hits } } = results;
    if (total === 0 || isEmpty(cuMap)) {
      return (
        <div>
          <Header as="h1" content={t('search.results.title')} />
          <div>
            <Trans i18nKey="search.results.no-results">
              Your search for <strong style={{ fontStyle: 'italic' }}>{{ query }}</strong> found no results.
            </Trans>
          </div>
        </div>
      );
    }
    return (
      <div>
        <Header as="h1">
          {t('search.results.title')}
          <Header.Subheader>
            {t('search.results.search-summary', { total, pageNo, took: took / 1000 })}
          </Header.Subheader>
        </Header>
        <Table sortable basic="very" className="index-list">
          <Table.Body>
            {hits.map(this.renderHit)}
          </Table.Body>
        </Table>
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
      </div>
    );
  }
}

export default connect(state => ({
  filters: filterSelectors.getFilters(state.filters, 'search'),
}))(translate()(SearchResults));


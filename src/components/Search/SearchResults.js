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

  renderHit = (hit) => {
    const { cuMap, t }                               = this.props;
    const { _source: src, highlight, _score: score } = hit;

    let name = src.name;
    if (highlight && Array.isArray(highlight.name) && highlight.name.length > 0) {
      name = <span dangerouslySetInnerHTML={{ __html: highlight.name.join(' ') }} />;
    }

    let description = src.description;
    if (highlight && Array.isArray(highlight.description) && highlight.description.length > 0) {
      description = <span dangerouslySetInnerHTML={{ __html: highlight.description.join(' ') }} />;
    }

    let filmDate = '';
    if (src.film_date) {
      filmDate = t('values.date', { date: new Date(src.film_date) });
    }

    return (
      <Table.Row key={src.mdb_uid} verticalAlign="top">
        <Table.Cell collapsing singleLine width={1}>
          <strong>{filmDate}</strong>
        </Table.Cell>
        <Table.Cell>
          <span>
          <Label>{t(`constants.content-types.${src.content_type}`)}</Label>
          <Link to={canonicalLink(cuMap[src.mdb_uid] || { id: src.mdb_uid, content_type: src.content_type })}>
            {name}
          </Link>
            &nbsp;&nbsp;
            {
              src.duration ?
                <small>{moment.duration(src.duration, 'seconds').format('hh:mm:ss')}</small> :
                null
            }
          </span>
          {description ? <div>{description}</div> : null}
        </Table.Cell>
        <Table.Cell collapsing textAlign="right">
          {score}
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { filters, wip, err, results, pageNo, pageSize, language, t, handlePageChange } = this.props;

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
    if (total === 0) {
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


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Trans, translate } from 'react-i18next';
import { Header, Table } from 'semantic-ui-react';

import { canonicalLink, formatError, isEmpty } from '../../helpers/utils';
import { ErrorSplash, LoadingSplash } from '../shared/Splash';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';

class SearchResults extends Component {
  static propTypes = {
    query: PropTypes.string,
    results: PropTypes.object,
    cuMap: PropTypes.objectOf(shapes.ContentUnit),
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    query: '',
    results: null,
    cuMap: {},
    wip: false,
    err: null,
  };

  renderHit = (hit) => {
    const { t }                                      = this.props;
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
          <Link to={canonicalLink({ id: src.mdb_uid, content_type: src.content_type })}>
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
    const { wip, err, query, results, t } = this.props;

    if (err) {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }

    if (query === '') {
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
            {t('search.results.search-summary', { total, took: took / 1000 })}
          </Header.Subheader>
        </Header>
        <Table sortable basic="very" className="index-list">
          <Table.Body>
            {hits.map(x => this.renderHit(x))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default translate()(SearchResults);

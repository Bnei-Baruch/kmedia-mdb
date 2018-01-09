import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Divider } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import Link from '../../Language/MultiLanguageLink';
import Pagination from '../../pagination/Pagination';
import ResultsPageHeader from '../../pagination/ResultsPageHeader';
import Filters from '../../Filters/Filters';
import filterComponents from '../../Filters/components';
import PageHeader from './PageHeader';
import ItemsList from './ItemsList';

const filters = [
  {
    name: 'date-filter',
    component: filterComponents.DateFilter
  },
];

class PublicationCollection extends Component {

  static propTypes = {
    collection: shapes.GenericCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    items: PropTypes.arrayOf(shapes.Article),
    itemsWip: PropTypes.bool,
    itemsErr: shapes.Error,
    pageNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onFiltersChanged: PropTypes.func.isRequired,
    onFiltersHydrated: PropTypes.func.isRequired,
  };

  static defaultProps = {
    collection: null,
    wip: false,
    err: null,
    items: [],
    itemsWip: false,
    itemsErr: null,
  };

  render() {
    const {
            collection,
            wip,
            err,
            items,
            itemsWip,
            itemsErr,
            pageNo,
            total,
            pageSize,
            language,
            t,
            onPageChange,
            onFiltersChanged,
            onFiltersHydrated
          } = this.props;

    if (err) {
      if (err.response && err.response.status === 404) {
        return (
          <FrownSplash
            text={t('messages.publication-not-found')}
            subtext={
              <Trans i18nKey="messages.publication-not-found-subtext">
                Try the <Link to="/publications">publications list</Link>...
              </Trans>
            }
          />
        );
      }

      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }

    let listContent;
    if (itemsErr) {
      listContent = <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    } else if (itemsWip) {
      listContent = <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else {
      listContent = (
        <Container className="padded">
          <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t} />
          <ItemsList items={items} />
        </Container>
      );
    }

    if (!collection) {
      return null;
    }

    return (
      <div>
        <PageHeader collection={collection} wip={wip} err={err} />
        <Filters
          namespace="publications-collection"
          filters={filters}
          onChange={onFiltersChanged}
          onHydrated={onFiltersHydrated}
        />
        {listContent}
        <Divider fitted />
        <Container className="padded" textAlign="center">
          <Pagination
            pageNo={pageNo}
            pageSize={pageSize}
            total={total}
            language={language}
            onChange={onPageChange}
          />
        </Container>
      </div>
    );
  }
}

export default translate()(PublicationCollection);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { formatError } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import UnitList from '../../pages/UnitList/Container';
import PageHeader from './Header';

class CollectionPage extends Component {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    collection: shapes.GenericCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
    renderUnit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    collection: null,
    wip: false,
    err: null,
  };

  extraFetchParams = () => ({ collection: this.props.collection.id });

  render() {
    const { collection, wip, err, namespace, t, renderUnit } = this.props;

    if (err) {
      if (err.response && err.response.status === 404) {
        return <FrownSplash
          text={t('messages.not-found')}
          subtext={t('messages.not-found-subtext')}
        />;
      }

      return <ErrorSplash
        text={t('messages.server-error')}
        subtext={formatError(err)}
      />;
    }

    if (wip) {
      return <LoadingSplash
        text={t('messages.loading')}
        subtext={t('messages.loading-subtext')}
      />;
    }

    if (!collection) {
      return null;
    }

    return (
      <div>
        <PageHeader collection={collection} namespace={namespace} t={t} />
        <UnitList
          namespace={namespace}
          extraFetchParams={this.extraFetchParams}
          renderUnit={renderUnit}
        />
      </div>
    );
  }
}

export default translate()(CollectionPage);

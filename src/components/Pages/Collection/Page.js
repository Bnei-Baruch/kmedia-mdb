import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import UnitList from '../../Pages/UnitList/Container';
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

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
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

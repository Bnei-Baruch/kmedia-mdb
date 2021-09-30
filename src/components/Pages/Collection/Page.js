import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import UnitList from '../UnitList/Container';
import PageHeader from './Header';

const CollectionPage = ({ collection = null, wip = false, err = null, namespace, t, renderUnit }) => {

  // Most chances we already have the collection either SSR or some nav link.
  // Only in case we don't, we'll show wipErr.
  if (!collection) {
    return WipErr({ wip, err, t });
  }

  return (
    <div className="collection-page">
      <PageHeader collection={collection} namespace={namespace} />
      <UnitList
        key={namespace}
        namespace={namespace}
        extraFetchParams={{ collection: collection.id }}
      />
    </div>
  );
};

CollectionPage.propTypes = {
  namespace: PropTypes.string.isRequired,
  collection: shapes.GenericCollection,
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired
};

export default withNamespaces()(CollectionPage);

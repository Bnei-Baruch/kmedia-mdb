import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import UnitList from '../UnitList/Container';
import PageHeader from './Header';

const CollectionPage = ({ collection = null, wip = false, err = null, namespace, renderUnit }) => {
  const { t } = useTranslation('common', { useSuspense: false });

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
        renderUnit={renderUnit}
      />
    </div>
  );
};

CollectionPage.propTypes = {
  namespace: PropTypes.string.isRequired,
  collection: shapes.GenericCollection,
  wip: shapes.WIP,
  err: shapes.Error,
  renderUnit: PropTypes.func.isRequired,
};

export default CollectionPage;

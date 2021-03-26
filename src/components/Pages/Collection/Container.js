import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { actions, selectors as mdb } from '../../../redux/modules/mdb';
import { actions as statsActions } from '../../../redux/modules/stats';
import Page from './Page';

const CollectionContainer = ({ namespace, renderUnit, id }) => {
  const { id: _id } = useParams();
  id ??= _id;

  const collection = useSelector(state => mdb.getCollectionById(state.mdb, id));
  const wip        = useSelector(state => mdb.getWip(state.mdb));
  const errors     = useSelector(state => mdb.getErrors(state.mdb));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(statsActions.clearCUStats(namespace));
  }, [namespace, dispatch]);

  useEffect(() => {
    if (!Object.prototype.hasOwnProperty.call(wip.collections, id)) {
      dispatch(actions.fetchCollection(id));
    }

  }, [id, wip, dispatch]);

  return (
    <Page
      namespace={namespace}
      collection={collection}
      wip={wip.collections[id]}
      err={errors.collections[id]}
      renderUnit={renderUnit}
    />
  );
};

export default CollectionContainer;

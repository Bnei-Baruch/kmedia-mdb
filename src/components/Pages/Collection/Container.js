import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { actions as mdbActions } from '../../../redux/modules/mdb';
import { actions as statsActions } from '../../../redux/modules/stats';
import Page from './Page';
import { mdbGetCollectionByIdSelector, mdbGetErrorsSelector, mdbGetWipFn } from '../../../redux/selectors';

const CollectionContainer = ({ namespace, renderUnit, id }) => {
  const { id: _id } = useParams();
  id ?? (id = _id);

  const [collection] = useSelector(state => mdbGetCollectionByIdSelector(state, [id]));
  const wip        = useSelector(mdbGetWipFn);
  const errors     = useSelector(mdbGetErrorsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(statsActions.clearCUStats(namespace));
  }, [namespace, dispatch]);

  useEffect(() => {
    if (!Object.prototype.hasOwnProperty.call(wip.collections, id)) {
      dispatch(mdbActions.fetchCollection(id));
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

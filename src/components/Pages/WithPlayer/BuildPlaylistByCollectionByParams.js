import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actions as mdbActions, selectors as mdb } from '../../../redux/modules/mdb';
import BuildPlaylistByCollection from './BuildPlaylistByCollection';

const BuildPlaylistByCollectionByParams = () => {
  const { id, cuId: routeCuId } = useParams();

  const fetched = useSelector(state => mdb.getFullCollectionFetched(state.mdb)?.[id]);
  const wip     = useSelector(state => mdb.getWip(state.mdb).collections[id]);
  const cuId    = routeCuId;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !fetched) {
      dispatch(mdbActions.fetchCollection(id));
    }
  }, [wip, fetched, id]);

  return <BuildPlaylistByCollection cuId={cuId} id={id} />;
};

export default BuildPlaylistByCollectionByParams;

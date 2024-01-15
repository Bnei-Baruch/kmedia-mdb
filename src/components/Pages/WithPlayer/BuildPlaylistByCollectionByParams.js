import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actions as mdbActions } from '../../../redux/modules/mdb';
import BuildPlaylistByCollection from './BuildPlaylistByCollection';
import { mdbGetFullCollectionFetchedSelector, mdbGetWipFn } from '../../../redux/selectors';

const BuildPlaylistByCollectionByParams = () => {
  const { id, cuId: routeCuId } = useParams();

  const fetched = useSelector(mdbGetFullCollectionFetchedSelector)?.[id];
  const wip     = useSelector(mdbGetWipFn).collections[id];
  const cuId    = routeCuId;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !fetched) {
      dispatch(mdbActions.fetchCollection(id));
    }
  }, [wip, fetched, id]);

  return <BuildPlaylistByCollection cuId={cuId} id={id}/>;
};

export default BuildPlaylistByCollectionByParams;

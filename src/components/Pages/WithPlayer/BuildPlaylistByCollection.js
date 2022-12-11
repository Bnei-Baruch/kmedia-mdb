import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/playlist';
import { selectors as mdb } from '../../../redux/modules/mdb';

const BuildPlaylistByCollection = ({ cuId, id }) => {
  const { cuId: prevCuId, cId: prevCId, wip } = useSelector(state => selectors.getInfo(state.playlist));

  const fetched  = useSelector(state => mdb.getFullCollectionFetched(state.mdb))[id];
  const dispatch = useDispatch();

  useEffect(() => {
    if (wip || !fetched) return;

    if (id !== prevCId) {
      dispatch(actions.build(id, cuId));
    } else if (cuId && prevCuId !== cuId) {
      dispatch(actions.select(cuId));
    }
  }, [id, cuId, wip, fetched]);

  return null;
};

export default BuildPlaylistByCollection;

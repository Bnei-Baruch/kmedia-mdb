import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/playlist';
import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice/mdbSlice';
import Helmets from '../../shared/Helmets';

const BuildPlaylistByCollection = ({ cuId, id }) => {
  const { cuId: prevCuId, cId: prevCId, wip } = useSelector(state => selectors.getInfo(state.playlist));

  const fetched  = useSelector(state => mdb.getFullCollectionFetched(state.mdb))?.[id];
  const dispatch = useDispatch();

  useEffect(() => {
    if (wip || !fetched) return;

    if (id !== prevCId) {
      dispatch(actions.build(id, cuId));
    } else if (cuId && prevCuId !== cuId) {
      dispatch(actions.select({ cuId, id: cuId }));
    }
  }, [id, cuId, wip, fetched]);

  return <Helmets.AVUnit id={cuId} />;
};

export default BuildPlaylistByCollection;

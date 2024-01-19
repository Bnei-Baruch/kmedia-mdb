import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../../redux/modules/playlist';
import Helmets from '../../shared/Helmets';
import { mdbGetFullCollectionFetchedSelector, playlistGetInfoSelector } from '../../../redux/selectors';

const BuildPlaylistByCollection = ({ cuId, id }) => {
  const { cuId: prevCuId, cId: prevCId, wip } = useSelector(playlistGetInfoSelector);

  const fetched  = useSelector(mdbGetFullCollectionFetchedSelector)?.[id];
  const dispatch = useDispatch();

  useEffect(() => {
    if (wip || !fetched) return;

    if (id !== prevCId) {
      dispatch(actions.build(id, cuId));
    } else if (cuId && prevCuId !== cuId) {
      dispatch(actions.select({ cuId, id: cuId }));
    }
  }, [id, cuId, wip, fetched]);

  return <Helmets.AVUnit id={cuId}/>;
};

export default BuildPlaylistByCollection;

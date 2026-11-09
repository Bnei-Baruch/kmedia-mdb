import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../../redux/modules/playlist';
import Helmets from '../../shared/Helmets';
import {
  mdbGetCollectionByIdSelector,
  mdbGetFullCollectionFetchedSelector,
  playlistGetInfoSelector
} from '../../../redux/selectors';

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, cuId, wip, fetched]);

  // /c/:id without a unit: the playlist (and its selected unit) is built on the client only,
  // so the head is built from the playlist's unit, else the collection's first one (what SSR loaded).
  const collection   = useSelector(state => mdbGetCollectionByIdSelector(state, [id])[0]);
  const headCuId     = cuId || prevCuId || collection?.cuIDs?.[0];

  return <Helmets.AVUnit id={headCuId}/>;
};

export default BuildPlaylistByCollection;

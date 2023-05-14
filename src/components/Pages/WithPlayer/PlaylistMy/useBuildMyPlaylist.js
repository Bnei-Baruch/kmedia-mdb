import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

import { actions, selectors } from '../../../../redux/modules/playlist';
import { getActivePartFromQuery } from '../../../../helpers/player';

const useBuildMyPlaylist = () => {
  const { id }   = useParams();
  const location = useLocation();

  const { pId, id: itemId, wip } = useSelector(state => selectors.getInfo(state.playlist));
  const itemIds                  = useSelector(state => selectors.getPlaylist(state.playlist));

  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== pId && !wip) {
      dispatch(actions.myPlaylistBuild(id));
    }
  }, [id, pId, wip]);

  useEffect(() => {
    if (itemId) {
      const arr   = itemId.split('_');
      const newAp = getActivePartFromQuery(location);
      if (arr[1] !== newAp) {
        const id = itemIds[newAp];
        dispatch(actions.select({ cuId: id.split('_')[0], id }));
      }
    }
  }, [itemIds, itemId, location]);

  return itemIds.length === 0;
};

export default useBuildMyPlaylist;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

import { actions, selectors } from '../../../../../lib/redux/slices/playlistSlice/playlistSlice';
import { getActivePartFromQuery } from '../../../../../lib/redux/slices/playlistSlice/helper';

const useBuildMyPlaylist = () => {
  const { id }   = useParams();
  const location = useLocation();

  const { pId, id: itemId, wip } = useSelector(state => selectors.getInfo(state.playlist));
  const items                  = useSelector(state => selectors.getPlaylist(state.playlist));

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
        const { id: _id } = items[newAp] || false;
        _id && dispatch(actions.select({ cuId: _id.split('_')[0], id: _id }));
      }
    }
  }, [items, itemId, location]);

  return items.length === 0;
};

export default useBuildMyPlaylist;

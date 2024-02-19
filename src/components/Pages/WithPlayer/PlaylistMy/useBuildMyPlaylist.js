import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

import { actions } from '../../../../redux/modules/playlist';
import { getActivePartFromQuery } from '../../../../helpers/player';
import { playlistGetInfoSelector, playlistGetPlaylistSelector } from '../../../../redux/selectors';

const useBuildMyPlaylist = () => {
  const { id }   = useParams();
  const location = useLocation();

  const { pId, id: itemId, wip } = useSelector(playlistGetInfoSelector);
  const items                    = useSelector(playlistGetPlaylistSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== pId && !wip) {
      dispatch(actions.myPlaylistBuild(id));
    }
  }, [id, pId, wip, dispatch]);

  useEffect(() => {
    if (itemId) {
      const arr   = itemId.split('_');
      const newAp = getActivePartFromQuery(location);
      if (arr[1] !== newAp) {
        const { id: _id } = items[newAp] || false;
        _id && dispatch(actions.select({ cuId: _id.split('_')[0], id: _id }));
      }
    }
  }, [items, itemId, location, dispatch]);

  return items.length === 0;
};

export default useBuildMyPlaylist;

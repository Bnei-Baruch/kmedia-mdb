import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

import { actions, selectors } from '../../../../redux/modules/playlist';
import { getActivePartFromQuery } from '../../../../helpers/player';

const useBuildMyPlaylist = () => {
  const { id }   = useParams();
  const location = useLocation();

  const { pId, cuId, wip } = useSelector(state => selectors.getInfo(state.playlist));
  const cuIds              = useSelector(state => selectors.getPlaylist(state.playlist));

  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== pId && !wip) {
      dispatch(actions.myPlaylistBuild(id));
    }
  }, [id, pId, wip]);

  useEffect(() => {
    if (cuId) {
      const up    = cuIds.findIndex(id => cuId === id);
      const newUp = getActivePartFromQuery(location);
      if (up !== newUp) {
        dispatch(actions.select(cuIds[newUp]));
      }
    }
  }, [cuIds, cuId, location]);

  return cuIds.length === 0;
};

export default useBuildMyPlaylist;

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { findPlayedFile } from '../../components/Player/helper';
import { actions } from '../../redux/modules/player';
import { selectors as playlist } from '../../redux/modules/playlist';
import { load, setup, init, isPlayerReady } from './adapter';

const PlayerBehavior = () => {
  const dispatch = useDispatch();

  const item = useSelector(state => playlist.getPlayed(state.playlist), shallowEqual);
  const info = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);

  const file = useMemo(() => findPlayedFile(item, info), [item, info]);

  //init jwplayer by element id,
  useEffect(() => {
    if (!info.isReady || !file?.src) return;

    const playlistItem = { 'file': file.src, image: file.image };
    if (!isPlayerReady()) {
      setup({
        controls: false,
        playlist: [playlistItem],
        preload: 'auto'
      });
      init(dispatch);
    } else {
      const { file: prevSrc } = window.jwplayer().getPlaylist()?.[0] || false;
      if (prevSrc === file.src) return;

      load([playlistItem]);
    }
    dispatch(actions.setFile(file));
  }, [file.src, info.isReady, dispatch]);

  return null;
};

export default PlayerBehavior;

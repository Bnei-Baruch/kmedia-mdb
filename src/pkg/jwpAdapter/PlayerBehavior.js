import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { findPlayedFile } from '../../components/Player/helper';
import { actions } from '../../redux/modules/player';
import { playlistGetInfoSelector, playlistGetPlayedSelector } from '../../redux/selectors';
import { init, isPlayerReady, load, setup } from './adapter';

const PlayerBehavior = () => {
  const dispatch = useDispatch();

  const item = useSelector(playlistGetPlayedSelector);
  const info = useSelector(playlistGetInfoSelector);

  const file = useMemo(() => findPlayedFile(item, info), [item, info]);

  // Init jwplayer by element id.
  useEffect(() => {
    if (!info.isReady || !file?.src) return;

    const playlistItem = {
      file  : file.src,
      image : file.image,
      tracks: file.subtitles.map(s => ({
        kind    : 'captions',
        file    : s.src,
        label   : s.language,
        language: s.language
      }))
    };
    if (!isPlayerReady()) {
      setup({
        controls : false,
        playlist : [playlistItem],
        preload  : 'auto',
        autostart: false,
        pipIcon  : 'enabled'
      });
      init(dispatch);
    } else {
      const { file: prevSrc } = window.jwplayer().getPlaylist()?.[0] || false;
      if (prevSrc === file.src) return;

      load([playlistItem]);
    }

    dispatch(actions.setFile(file));
  }, [file, info.isReady, dispatch]);

  return null;
};

export default PlayerBehavior;

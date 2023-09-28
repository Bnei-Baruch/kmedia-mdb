import { useEffect, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { findPlayedFile } from '../../lib/player/helper';
import { actions, playerSlice } from '../../lib/redux/slices/playerSlice/playerSlice';
import { selectors as playlist, playlistSlice } from '../../lib/redux/slices/playlistSlice/playlistSlice';
import { load, setup, init, isPlayerReady } from './adapter';
import { DeviceInfoContext } from '../../src/helpers/app-contexts';

const PlayerBehavior = () => {
  const dispatch = useDispatch();

  const { deviceInfo } = useContext(DeviceInfoContext);

  const item = useSelector(state => playlist.getPlayed(state.playlist));
  const info = useSelector(state => playlist.getInfo(state.playlist));

  const file = useMemo(() => findPlayedFile(item, info), [item, info]);
  // Init jwplayer by element id.
  useEffect(() => {
    if (!file?.src) return;

    console.log('PlayerBehavior effect', window.jwplayer);
    const playlistItem = {
      file: file.src,
      image: file.image,
      tracks: file.subtitles.map(s => ({
        kind: 'captions',
        file: s.src,
        label: s.language,
        language: s.language
      }))
    };
    if (!isPlayerReady()) {
      setup({
        controls: false,
        playlist: [playlistItem],
        preload: 'auto',
        autostart: false,
        pipIcon: 'enabled'
      });
      init(dispatch, deviceInfo);
    } else {
      const { file: prevSrc } = window.jwplayer().getPlaylist()?.[0] || false;
      if (prevSrc === file.src) return;

      load([playlistItem]);
    }

    dispatch(playerSlice.actions.setFile(file));
  }, [file, dispatch, deviceInfo]);

  return null;
};

export default PlayerBehavior;

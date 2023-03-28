import { useEffect, useContext } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { findPlayedFile } from '../../components/Player/helper';
import { actions } from '../../redux/modules/player';
import { selectors as playlist } from '../../redux/modules/playlist';
import { load, setup, init, isPlayerReady } from './adapter';
import { DeviceInfoContext } from '../../helpers/app-contexts';

const PlayerBehavior = () => {
  const dispatch = useDispatch();

  const { deviceInfo } = useContext(DeviceInfoContext);

  const item = useSelector(state => playlist.getPlayed(state.playlist), shallowEqual);
  const info = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);

  const file = findPlayedFile(item, info);

  //init jwplayer by element id,
  useEffect(() => {
    if (!info.isReady || !file?.src) return;

    const playlistItem = { 'file': file.src, image: file.image };
    if (!isPlayerReady()) {
      setup({
        controls: false,
        playlist: [playlistItem],
        preload: 'auto',
        autoplay: true
      });
      init(dispatch, deviceInfo);
    } else {
      const { file: prevSrc } = window.jwplayer().getPlaylist()?.[0] || false;
      if (prevSrc === file.src) return;

      load([playlistItem]);
    }

    dispatch(actions.setFile(file));
  }, [file, info.isReady, dispatch, deviceInfo]);

  return null;
};

export default PlayerBehavior;

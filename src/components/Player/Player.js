import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fscreen from 'fscreen';
import { Ref } from 'semantic-ui-react';
import { isEqual } from 'lodash/lang';

import { initPlayerEvents, removePlayerButtons, findPlayedFile } from './helper';
import { selectors as player } from '../../redux/modules/player';
import { selectors as playlist } from '../../redux/modules/playlist';
import { JWPLAYER_ID, MT_VIDEO, PLAYER_OVER_MODES } from '../../helpers/consts';
import Controls from './Controls/Controls';
import Settings from './Settings/Settings';
import Sharing from './Sharing/Sharing';
import { startEndFromQuery } from './Controls/helper';
import { useLocation } from 'react-router-dom';

const CLASSES_BY_MODE = {
  [PLAYER_OVER_MODES.settings]: ' is-settings',
  [PLAYER_OVER_MODES.languages]: ' is-settings is-language',
  [PLAYER_OVER_MODES.share]: 'is-sharing',
  [PLAYER_OVER_MODES.none]: '',
};

const Player = () => {

  const location = useLocation();

  const { start, end } = startEndFromQuery(location);

  const overMode = useSelector(state => player.getOverMode(state.player));
  /*
  const isControls = useSelector(state => player.isControls(state.player));
  const isPlay     = useSelector(state => player.isPlay(state.player));
*/
  const info    = useSelector(state => playlist.getInfo(state.playlist), isEqual);
  const item    = useSelector(state => playlist.getPlayed(state.playlist), isEqual);
  const isReady = useSelector(state => player.isReady(state.player));

  const { preImageUrl } = item;

  const checkStopTime = useCallback(d => {
    if (d.currentTime > end) {
      const player = window.jwplayer(JWPLAYER_ID);
      player.pause();
      player.off('time', checkStopTime);
    }
  }, [end]);

  const ref     = useRef();
  const settRef = useRef();

  const file     = useMemo(() => findPlayedFile(item, info), [item, info]);
  const dispatch = useDispatch();

  //init jwplayer by element id
  useEffect(() => {
    const player = window.jwplayer(JWPLAYER_ID);

    if (player.setup && file.src) {
      player.setup({
        controls: false,
        playlist: [{
          'file': file.src,
          'image': preImageUrl
        }]
      });

      initPlayerEvents(player, dispatch);
    }

    return () => {
      removePlayerButtons(player);
      player.remove();
    };
  }, [ref.current, preImageUrl, file.src, start, end]);

  //start and stop slice
  useEffect(() => {
    if (!isReady) return () => null;

    const player         = window.jwplayer();
    const { start, end } = startEndFromQuery(location);
    if (start || end) {
      player.play().seek(start).pause();
      player.on('time', checkStopTime);
    }
    return () => {
      player.off('time', checkStopTime);
    };
  }, [isReady, location]);

  //Switch played file
  useEffect(() => {
    const player = window.jwplayer(JWPLAYER_ID);
    if (player.load && file.src) {
      const img = file.type === MT_VIDEO ? preImageUrl : '';
      player.load([{ 'file': file.src, 'image': img }]);
    }
  }, [file.src]);

  const handleFullScreen = () => fscreen.requestFullscreen(settRef.current);

  return (
    <Ref innerRef={settRef}>
      <div className="player">
        <div className={`web ${CLASSES_BY_MODE[overMode]}`}>

          <Controls fullScreen={handleFullScreen} />
          <Settings file={file} />
          <Sharing />

          <Ref innerRef={ref}>
            <div id={JWPLAYER_ID}> video</div>
          </Ref>
        </div>
      </div>
    </Ref>
  );

};

export default Player;

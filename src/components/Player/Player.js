import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fscreen from 'fscreen';
import { Ref } from 'semantic-ui-react';
import { isEqual } from 'lodash/lang';

import { findPlayedFile, initPlayerEvents, removePlayerEvents } from './helper';
import { selectors as player, actions } from '../../redux/modules/player';
import { selectors as playlist } from '../../redux/modules/playlist';
import { MT_VIDEO, PLAYER_OVER_MODES, JWPLAYER_ID } from '../../helpers/consts';
import Controls from './Controls/Controls';
import Settings from './Settings/Settings';
import Sharing from './Sharing/Sharing';
import { useLocation } from 'react-router-dom';
import { startEndFromQuery } from './Controls/helper';
import { noop } from '../../helpers/utils';

const CLASSES_BY_MODE = {
  [PLAYER_OVER_MODES.settings]: ' is-settings',
  [PLAYER_OVER_MODES.languages]: ' is-settings is-language',
  [PLAYER_OVER_MODES.share]: 'is-sharing',
  [PLAYER_OVER_MODES.none]: '',
};

const Player = () => {
  const settRef = useRef();
  const ref     = useRef();

  const mode    = useSelector(state => player.getOverMode(state.player));
  const info    = useSelector(state => playlist.getInfo(state.playlist), isEqual);
  const item    = useSelector(state => playlist.getPlayed(state.playlist), isEqual);
  const isReady = useSelector(state => player.isReady(state.player));

  const { preImageUrl } = item;

  const file     = useMemo(() => findPlayedFile(item, info), [item, info]);
  const dispatch = useDispatch();

  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const checkStopTime = useCallback(d => {
    if (d.currentTime > end) {
      const player = window.jwplayer();
      player.pause();
      player.off('time', checkStopTime);
    }
  }, [end]);

  //init jwplayer by element id,
  useEffect(() => {
    // can't be init without file, but it must be call once
    const player = window.jwplayer(JWPLAYER_ID);
    if (!isReady || !!file.src) {
      player.setup({
        controls: false,
        playlist: [{ 'file': file.src }]
      });
      initPlayerEvents(player, dispatch);
    }
    return () => {
      removePlayerEvents(player);
      player.remove();
    };
  }, [ref.current, file.src]);

  //start and stop slice
  useEffect(() => {
    if (!isReady) return noop;

    const player = window.jwplayer();
    if (start || end) {
      player.play().seek(start).pause();
      player.on('time', checkStopTime);
    }
    return () => {
      player.off('time', checkStopTime);
    };
  }, [isReady, start, end]);

  //load file to jwplayer
  useEffect(() => {
    if (isReady) {
      const player = window.jwplayer();
      if (file) {
        const img = file.type === MT_VIDEO ? preImageUrl : '';
        player.load([{ 'file': file.src, 'image': img }]);
        dispatch(actions.setFile(file));
      }
    }
  }, [isReady, file]);

  const handleFullScreen = () => fscreen.requestFullscreen(settRef.current);

  const handleLeave = () => dispatch(actions.setOverMode(PLAYER_OVER_MODES.none));

  return (
    <Ref innerRef={settRef}>
      <div className="player" onMouseLeave={handleLeave}>
        <div className={`web ${CLASSES_BY_MODE[mode]}`}>
          <Controls fullScreen={handleFullScreen} />
          <Settings />
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

import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fscreen from 'fscreen';
import { Ref } from 'semantic-ui-react';
import { isEqual } from 'lodash/lang';

import { initPlayerEvents, removePlayerButtons, findPlayedFile } from './helper';
import { selectors as player } from '../../redux/modules/player';
import { selectors as playlist } from '../../redux/modules/playlist';
import { JWPLAYER_ID, MT_VIDEO } from '../../helpers/consts';
import Controls from './Controls/Controls';
import Settings from './Settings';
import Sharing from './Sharing';

const Player = ({ start = 100, end = 115 }) => {

  const overMode   = useSelector(state => player.getOverMode(state.player));
  const isControls = useSelector(state => player.isControls(state.player));
  const isPlay     = useSelector(state => player.isPlay(state.player));

  const info = useSelector(state => playlist.getInfo(state.playlist), isEqual);
  const item = useSelector(state => playlist.getPlayed(state.playlist), isEqual);

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

      if (start || end) {
        player.play().seek(start).pause();
        player.on('time', checkStopTime);
      }
    }

    return () => {
      removePlayerButtons(player);
      player.remove();
    };
  }, [ref.current, preImageUrl, file.src, start, end]);

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
        <div className="web">
          {/*<div className="web is-sharing">*/}
          {/* <div className='web is-settings'> */}
          {/* <div className='web is-settings is-language'> */}

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

import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Ref } from 'semantic-ui-react';
import { initPlayerEvents, findPlayedFile } from '../Player/helper';
import fscreen from 'fscreen';
import { selectors as player } from '../../redux/modules/player';
import { selectors as playlist } from '../../redux/modules/playlist';
import AVPlayerSettings from './AVPlayerSettings';
import { isEqual } from 'lodash/lang';
import { JWPLAYER_ID, MT_VIDEO, PLAYER_OVER_MODES } from '../../helpers/consts';
import AVPlayerOnControl from '../Player/Controls/Controls';
import AvSeekBar from './AvSeekBar';
import ShareFormDesktop from './Share/ShareFormDesktop';

const svg = `<svg fill="none" height="50" viewBox="0 0 50 50" width="50" xmlns="http://www.w3.org/2000/svg"><path d="m8 6h27v38h-27z" fill="#fff" stroke="#2185d0" stroke-linecap="square" stroke-width="2"/><path d="m40 16h4v25h-4z" fill="#fff" stroke="#2185d0" stroke-linecap="square" stroke-width="2"/><path d="m42 8 2 6v2h-4v-2z" fill="#fff"/><g stroke="#2185d0" stroke-width="2"><path d="m42 6v2m0 0-2 6v2h4v-2z" stroke-linecap="square"/><path d="m40 41h4v2c0 .5523-.4477 1-1 1h-2c-.5523 0-1-.4477-1-1z" fill="#fff" stroke-linecap="square"/><path d="m5 15h6"/><path d="m5 11h6"/><path d="m5 19h6"/><path d="m5 23h6"/><path d="m5 27h6"/><path d="m5 31h6"/><path d="m5 35h6"/><path d="m5 39h6"/></g></svg>`;

const AVPlayer = ({ start = 100, end = 115 }) => {

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
        playbackRateControls: false,
        allowFullscreen: false,
        pipIcon: false,
        mute: false,
        //controls: false,
        playlist: [{
          'file': file.src,
          'image': preImageUrl
        }]
      });

      initPlayerEvents(player, dispatch);
      player.addButton(svg, 'full screen', handleFullScreen, 'fullscreen', 'fullScreenClass');

      if (start || end) {
        player.play().seek(start).pause();
        player.on('time', checkStopTime);
      }
    }

    return () => {
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
      <div className="player_wrapper">
        {!overMode && (isControls || !isPlay) && <AVPlayerOnControl />}
        {(isControls || !isPlay) && <AvSeekBar duration={file.duration} start={start} end={end} />}
        {overMode === PLAYER_OVER_MODES.settings && <AVPlayerSettings file={file} />}
        {overMode === PLAYER_OVER_MODES.share && <ShareFormDesktop />}

        <div>
          <Ref innerRef={ref}>
            <div id={JWPLAYER_ID}> video</div>
          </Ref>
        </div>
      </div>
    </Ref>
  );

};

export default AVPlayer;

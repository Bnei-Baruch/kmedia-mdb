import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { selectors, actions } from '../../redux/modules/player';
import { actions as playlistActions, selectors as playlistSelectors } from '../../redux/modules/playlist';
import { Radio, Button } from 'semantic-ui-react';
import { stopBubbling } from '../../helpers/utils';
import { JWPLAYER_ID, MT_AUDIO, MT_VIDEO, PLAYER_OVER_MODES } from '../../helpers/consts';
import playerHelper from '../../helpers/player';

const seek = (e, pos) => {
  const p = window.jwplayer(JWPLAYER_ID);
  p.seek(p.getPosition() + pos);
  stopBubbling(e);
};

const AVPlayerOnControl = ({ file }) => {
  const isPlay                           = useSelector(state => selectors.isPlay(state.player));
  const { mediaType, cId, played: cuId } = useSelector(state => playlistSelectors.getInfo(state.playlist));
  const history                          = useHistory();

  const dispatch = useDispatch();

  const handleSeekForward  = e => seek(e, 10);
  const handleSeekBackward = e => seek(e, -10);

  const handlePlayPause = () => {
    const p = window.jwplayer(JWPLAYER_ID);
    (p.getState() === 'playing') ? p.pause() : p.play();
  };

  const handleOpenSettings = e => {
    dispatch(actions.setOverMode(PLAYER_OVER_MODES.settings));
    stopBubbling(e);
  };

  const handleOpenShare = e => {
    dispatch(actions.setOverMode(PLAYER_OVER_MODES.share));
    stopBubbling(e);
  };

  const handleNext = e => {
    dispatch(playlistActions.next());
    stopBubbling(e);
  };

  const handlePrev = e => {
    dispatch(playlistActions.prev());
    stopBubbling(e);
  };

  const handleMediaType = (e, { checked }) => {
    playerHelper.setMediaTypeInQuery(history, checked ? MT_AUDIO : MT_VIDEO);
    dispatch(playlistActions.build(cId, cuId));
    stopBubbling(e);
  };

  return (
    <div className="player_on-hover">
      <div>
        <Radio toggle label="audio mode" radio={mediaType === MT_AUDIO} onChange={handleMediaType} />
        <div>
          <Button icon="setting" onClick={handleOpenSettings} />
          <Button icon="share alternate" onClick={handleOpenShare} />
        </div>
      </div>
      <div>
        <Button icon="step forward" onClick={handleNext} />
        <div>
          <Button icon="arrow alternate circle right" onClick={handleSeekForward} />
          <Button icon={isPlay ? 'pause' : 'play'} onClick={handlePlayPause} />
          <Button icon="arrow alternate circle left" onClick={handleSeekBackward} />
        </div>
        <Button icon="step backward" onClick={handlePrev} />
      </div>
      <div></div>

    </div>
  );

};

export default AVPlayerOnControl;

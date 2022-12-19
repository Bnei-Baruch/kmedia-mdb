import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as player, actions } from '../../redux/modules/player';
import Settings from './Settings/Settings';
import Sharing from './Sharing/Sharing';
import ControlsMobile from './Controls/ControlsMobile';
import { PLAYER_OVER_MODES } from '../../helpers/consts';
import { stopBubbling } from '../../helpers/utils';

const PlayerToolsMobile = ({ handleFullScreen, Player }) => {
  const isPlayerReady = useSelector(state => player.isReady(state.player));

  const dispatch = useDispatch();

  const handleTouch = e => {
    stopBubbling(e);
    dispatch(actions.setOverMode(PLAYER_OVER_MODES.active));
  };

  return (
    <>
      <div className="player-wrapper" onClick={handleTouch}>
        {Player}
        {isPlayerReady && <ControlsMobile openOnFull={handleFullScreen} />}
      </div>
      {
        isPlayerReady && (
          <>
            <Settings />
            <Sharing />
          </>
        )
      }
    </>
  );
};

export default PlayerToolsMobile;

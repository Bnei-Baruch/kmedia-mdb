import React from 'react';
import { useSelector } from 'react-redux';

import { selectors as player } from '../../redux/modules/player';
import Settings from './Settings/Settings';
import Sharing from './Sharing/Sharing';
import ControlsMobile from './Controls/ControlsMobile';
import AudioBg from './AudioBg';
import Preloader from './Controls/Preloader';

const PlayerToolsMobile = ({ fullscreenRef, Player }) => {
  const isPlayerReady = useSelector(state => player.isReady(state.player));

  return (
    <>
      <div className="player-wrapper">
        {Player}
        <AudioBg />
        {isPlayerReady && <ControlsMobile fullscreenRef={fullscreenRef} />}
      </div>
      {
        isPlayerReady && (
          <>
            <Preloader />
            <Settings />
            <Sharing />
          </>
        )
      }
    </>
  );
};

export default PlayerToolsMobile;

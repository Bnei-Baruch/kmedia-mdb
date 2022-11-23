import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { selectors as player, actions } from '../../redux/modules/player';
import WipErr from '../shared/WipErr/WipErr';
import Settings from './Settings/Settings';
import Sharing from './Sharing/Sharing';
import ControlsMobile from './Controls/ControlsMobile';
import { PLAYER_OVER_MODES } from '../../helpers/consts';
import { stopBubbling } from '../../helpers/utils';

const PlayerToolsMobile = ({ handleFullScreen, Player, t }) => {
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
        <ControlsMobile openOnFull={handleFullScreen} />
      </div>
      {
        isPlayerReady ? (
          <>
            <Settings />
            <Sharing />
          </>
        ) : <WipErr t={t} wip={true} />
      }
    </>
  );
};

export default withNamespaces()(PlayerToolsMobile);

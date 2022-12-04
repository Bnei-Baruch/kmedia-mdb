import React, { useRef, useContext } from 'react';
import { useSelector } from 'react-redux';
import fscreen from 'fscreen';
import { Ref } from 'semantic-ui-react';

import { selectors as player, selectors } from '../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../helpers/consts';
import Player from './Player';
import UpdateLocation from './UpdateLocation';
import PlayerToolsWeb from './PlayerToolsWeb';
import PlayerToolsMobile from './PlayerToolsMobile';
import AppendChronicle from './AppendChronicle';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import clsx from 'clsx';

const CLASSES_BY_MODE = {
  [PLAYER_OVER_MODES.settings]: 'is-settings',
  [PLAYER_OVER_MODES.languages]: 'is-settings is-language',
  [PLAYER_OVER_MODES.share]: 'is-sharing',
  [PLAYER_OVER_MODES.active]: 'is-active',
  [PLAYER_OVER_MODES.firstTime]: 'is-active is-first-time',
  [PLAYER_OVER_MODES.none]: '',
};

const PlayerContainer = () => {

  const settRef      = useRef();
  const mode         = useSelector(state => player.getOverMode(state.player));
  const isFullScreen = useSelector(state => selectors.isFullScreen(state.player));

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const handleFullScreen   = () => {
    fscreen.fullscreenEnabled ? fscreen.requestFullscreen(settRef.current) : alert('fullscreen not supported');
  };

  return (
    <Ref innerRef={settRef}>
      <div className="player">
        <AppendChronicle />
        <UpdateLocation />
        <div className={clsx(CLASSES_BY_MODE[mode], isMobileDevice ? 'is-mobile' : 'is-web', { 'is-fullscreen': isFullScreen })}>
          {
            isMobileDevice ? (
              <PlayerToolsMobile Player={<Player />} handleFullScreen={handleFullScreen} />
            ) : (
              <>
                <Player />
                <PlayerToolsWeb handleFullScreen={handleFullScreen} />
              </>
            )
          }
        </div>
      </div>
    </Ref>
  );

};

export default React.memo(PlayerContainer);

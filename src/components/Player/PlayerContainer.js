import React, { useRef, useContext } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { selectors as player, selectors } from '../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../helpers/consts';
import Player from '../../pkg/jwpAdapter/Player';
import UpdateLocation from './UpdateLocation';
import PlayerToolsWeb from './PlayerToolsWeb';
import PlayerToolsMobile from './PlayerToolsMobile';
import AppendChronicle from './AppendChronicle';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import clsx from 'clsx';
import { Ref } from 'semantic-ui-react';

const CLASSES_BY_MODE = {
  [PLAYER_OVER_MODES.settings]: 'is-settings',
  [PLAYER_OVER_MODES.languages]: 'is-settings is-language',
  [PLAYER_OVER_MODES.share]: 'is-sharing',
  [PLAYER_OVER_MODES.active]: 'is-active',
  [PLAYER_OVER_MODES.firstTime]: 'is-active is-first-time',
  [PLAYER_OVER_MODES.none]: '',
};

const PlayerContainer = () => {
  const fullscreenRef = useRef();
  const mode          = useSelector(state => player.getOverMode(state.player), shallowEqual);
  const isFullScreen  = useSelector(state => selectors.isFullScreen(state.player), shallowEqual);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const content = (
    <div className="player" dir="ltr">
      <AppendChronicle />
      <UpdateLocation />
      <div className={clsx(CLASSES_BY_MODE[mode], isMobileDevice ? 'is-mobile' : 'is-web', { 'is-fullscreen': isFullScreen })}>
        {
          isMobileDevice ? (
            <PlayerToolsMobile Player={<Player />} fullscreenRef={fullscreenRef} />
          ) : (
            <>
              <Player />
              <PlayerToolsWeb fullscreenRef={fullscreenRef} />
            </>
          )
        }
      </div>
    </div>
  );

  return (
    <Ref innerRef={fullscreenRef}>
      {content}
    </Ref>
  );
};
//TODO david remove memo after react-router update
export default React.memo(PlayerContainer);

import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import fscreen from 'fscreen';
import { Ref } from 'semantic-ui-react';

import { selectors as player } from '../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../helpers/consts';
import Player from './Player';
import UpdateQueries from './UpdateQueries';
import PlayerToolBars from './PlayerToolBars';
import AppendChronicle from './AppendChronicle';

const CLASSES_BY_MODE = {
  [PLAYER_OVER_MODES.settings]: 'is-settings',
  [PLAYER_OVER_MODES.languages]: 'is-settings is-language',
  [PLAYER_OVER_MODES.share]: 'is-sharing',
  [PLAYER_OVER_MODES.none]: '',
};

const PlayerContainer = () => {
  const settRef = useRef();
  const mode    = useSelector(state => player.getOverMode(state.player));

  const handleFullScreen = () => fscreen.requestFullscreen(settRef.current);

  return (
    <Ref innerRef={settRef}>
      <div className="player">
        <AppendChronicle />
        <UpdateQueries />
        <div className={`web ${CLASSES_BY_MODE[mode]}`}>
          <PlayerToolBars handleFullScreen={handleFullScreen} />
          <Player />
        </div>
      </div>
    </Ref>
  );

};

export default React.memo(PlayerContainer);

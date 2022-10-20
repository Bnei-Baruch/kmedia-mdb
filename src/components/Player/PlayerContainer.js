import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fscreen from 'fscreen';
import { Ref } from 'semantic-ui-react';

import { selectors as player, actions } from '../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../helpers/consts';
import Player from './Player';
import UpdateQueries from './UpdateQueries';
import PlayerToolBars from './PlayerToolBars';

const CLASSES_BY_MODE = {
  [PLAYER_OVER_MODES.settings]: 'is-settings',
  [PLAYER_OVER_MODES.languages]: 'is-settings is-language',
  [PLAYER_OVER_MODES.share]: 'is-sharing',
  [PLAYER_OVER_MODES.none]: '',
};

const PlayerContainer = () => {
  const settRef = useRef();
  const mode    = useSelector(state => player.getOverMode(state.player));

  const dispatch = useDispatch();

  const handleFullScreen = () => fscreen.requestFullscreen(settRef.current);

  const handleLeave = () => dispatch(actions.setOverMode(PLAYER_OVER_MODES.none));

  return (
    <Ref innerRef={settRef}>
      <div className="player" onMouseLeave={handleLeave}>
        <UpdateQueries />
        <div className={`web is-sharing ${CLASSES_BY_MODE[mode]}`}>
          <PlayerToolBars handleFullScreen={handleFullScreen} />
          <Player />
        </div>
      </div>
    </Ref>
  );

};

export default React.memo(PlayerContainer);

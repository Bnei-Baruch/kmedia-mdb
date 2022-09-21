import React, { useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import fscreen from 'fscreen';
import { Ref } from 'semantic-ui-react';

import { findPlayedFile } from './helper';
import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as player, actions } from '../../redux/modules/player';
import { PLAYER_OVER_MODES, JWPLAYER_ID, MT_VIDEO } from '../../helpers/consts';
import Controls from './Controls/Controls';
import WipErr from '../shared/WipErr/WipErr';
import { withNamespaces } from 'react-i18next';
import Settings from './Settings/Settings';
import Sharing from './Sharing/Sharing';
import UpdateQueries from './UpdateQueries';
import Player from './Player';

const CLASSES_BY_MODE = {
  [PLAYER_OVER_MODES.settings]: 'is-settings',
  [PLAYER_OVER_MODES.languages]: 'is-settings is-language',
  [PLAYER_OVER_MODES.share]: 'is-sharing',
  [PLAYER_OVER_MODES.none]: '',
};

const PlayerContainer = ({ t }) => {
  const settRef = useRef();
  const mode    = useSelector(state => player.getOverMode(state.player));
  const isReady = useSelector(state => player.isReady(state.player));
  const info    = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);
  const item    = useSelector(state => playlist.getPlayed(state.playlist), shallowEqual);

  const { preImageUrl } = item;

  const file = useMemo(() => findPlayedFile(item, info), [item, info]);

  const dispatch = useDispatch();

  //load file to jwplayer
  useEffect(() => {
    if (isReady && file) {
      const player = window.jwplayer(JWPLAYER_ID);
      const img    = file.type === MT_VIDEO ? preImageUrl : '';
      dispatch(actions.setFile(file));
      player.load([{ 'file': file.src, 'image': img }]).play().pause();
    }
  }, [isReady, file]);

  const handleFullScreen = () => fscreen.requestFullscreen(settRef.current);

  const handleLeave = () => dispatch(actions.setOverMode(PLAYER_OVER_MODES.none));

  return (
    <Ref innerRef={settRef}>
      <div className="player" onMouseLeave={handleLeave}>
        <UpdateQueries />
        <div className={`web ${CLASSES_BY_MODE[mode]}`}>
          {
            isReady ? (
              <>
                <Controls fullScreen={handleFullScreen} />
                <Settings />
                <Sharing />
              </>
            ) : <WipErr t={t} wip={true} />
          }
          <Player file={file} />
        </div>
      </div>
    </Ref>
  );

};

export default withNamespaces()(PlayerContainer);

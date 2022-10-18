import React from 'react';
import { useSelector } from 'react-redux';

import { selectors as player } from '../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../helpers/consts';
import Controls from './Controls/Controls';
import WipErr from '../shared/WipErr/WipErr';
import { withNamespaces } from 'react-i18next';
import Settings from './Settings/Settings';
import Sharing from './Sharing/Sharing';

const CLASSES_BY_MODE = {
  [PLAYER_OVER_MODES.settings]: 'is-settings',
  [PLAYER_OVER_MODES.languages]: 'is-settings is-language',
  [PLAYER_OVER_MODES.share]: 'is-sharing',
  [PLAYER_OVER_MODES.none]: '',
};

const PlayerToolBars = ({ handleFullScreen, t }) => {
  const isPlayerReady = useSelector(state => player.isReady(state.player));

  return (
    <>
      {
        isPlayerReady ? (
          <>
            <Controls fullScreen={handleFullScreen} />
            <Settings />
            <Sharing />
          </>
        ) : <WipErr t={t} wip={true} />
      }
    </>
  );

};

export default withNamespaces()(PlayerToolBars);

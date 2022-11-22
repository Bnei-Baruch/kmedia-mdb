import React from 'react';
import { useSelector } from 'react-redux';

import { selectors as player } from '../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../helpers/consts';
import Controls from './Controls/Controls';
import WipErr from '../shared/WipErr/WipErr';
import { withNamespaces } from 'react-i18next';
import Settings from './Settings/Settings';
import Sharing from './Sharing/Sharing';

const PlayerToolsWeb = ({ handleFullScreen, t }) => {
  const isPlayerReady = useSelector(state => player.isReady(state.player));

  return (
    <>
      {
        isPlayerReady ? (
          <>
            <Controls openOnFull={handleFullScreen} />
            <Settings />
            <Sharing />
          </>
        ) : <WipErr t={t} wip={true} />
      }
    </>
  );

};

export default withNamespaces()(PlayerToolsWeb);

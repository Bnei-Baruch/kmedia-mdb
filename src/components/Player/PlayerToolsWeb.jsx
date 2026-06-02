import React from 'react';
import { useSelector } from 'react-redux';

import ControlsWeb from './Controls/ControlsWeb';
import Settings from './Settings/Settings';
import Sharing from './Sharing/Sharing';
// import AudioBg from './AudioBg';
import Preloader from './Controls/Preloader';
import LabelVideo from './Sharing/LabelVideo';
import { playerIsReadySelector } from '../../redux/selectors';

const PlayerToolsWeb = ({ fullscreenRef }) => {
  const isReady = useSelector(playerIsReadySelector);

  return (
    <>
      <Preloader/>
      {
        isReady && <>
          {/*<AudioBg />*/}
          <ControlsWeb fullscreenRef={fullscreenRef}/>
          <Settings/>
          <Sharing/>
          <LabelVideo/>
        </>
      }
    </>
  );

};

export default PlayerToolsWeb;

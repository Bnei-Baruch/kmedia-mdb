import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import TranscriptionTabToolbarWeb from './TranscriptionTabToolbarWeb';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import TranscriptionTabToolbarMobile from './TranscriptionTabToolbarMobile';

const TranscriptionTab = () => {
  const { id }             = useParams();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const toolbar = isMobileDevice ? <TranscriptionTabToolbarMobile /> : <TranscriptionTabToolbarWeb />;

  return (
    <div className="player_page_tab">
      <TextLayoutWeb propId={id} toolbar={toolbar} playerPage={true} />
    </div>
  );
};

export default TranscriptionTab;

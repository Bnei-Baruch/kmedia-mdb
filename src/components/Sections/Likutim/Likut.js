import React, { useContext } from 'react';
import TextLayoutWeb from '../../Pages/WithText/TextLayoutWeb';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import TextLayoutMobile from '../../Pages/WithText/TextLayoutMobile';
import { usePrepareLikutAudio } from './usePrepareLikutAudio';
import LikutToolbarMobile from './LikutToolbarMobile';
import LikutToolbarWeb from './LikutToolbarWeb';

const LikutContainer = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const toolbar            = isMobileDevice ? <LikutToolbarMobile /> : <LikutToolbarWeb />;
  usePrepareLikutAudio();

  return isMobileDevice ? (
    <TextLayoutMobile toolbar={toolbar} />
  ) : (
    <TextLayoutWeb toolbar={toolbar} />
  );
};

export default LikutContainer;

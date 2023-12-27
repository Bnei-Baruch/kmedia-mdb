import React, { useContext } from 'react';
import TextLayoutWeb from '../../Pages/WithText/TextLayoutWeb';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import TextLayoutMobile from '../../Pages/WithText/TextLayoutMobile';
import SourceToolbarMobile from '../Source/SourceToolbarMobile';
import SourceToolbarWeb from '../Source/SourceToolbarWeb';
import { usePrepareLikutAudio } from './usePrepareLikutAudio';

const LikutContainer = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const toolbar            = isMobileDevice ? <SourceToolbarMobile /> : <SourceToolbarWeb />;
  usePrepareLikutAudio();

  return isMobileDevice ? (
    <TextLayoutMobile toolbar={toolbar} />
  ) : (
    <TextLayoutWeb toolbar={toolbar} />
  );
};

export default LikutContainer;

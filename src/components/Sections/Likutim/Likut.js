import React, { useContext } from 'react';
import TextLayoutWeb from '../../Pages/WithText/TextLayoutWeb';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import TextLayoutMobile from '../../Pages/WithText/TextLayoutMobile';
import { usePrepareLikutAudio } from './usePrepareLikutAudio';
import LikutToolbarMobile from './LikutToolbarMobile';
import LikutToolbarWeb from './LikutToolbarWeb';

const LikutContainer = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  usePrepareLikutAudio();

  return isMobileDevice ? (
    <TextLayoutMobile toolbar={<LikutToolbarMobile />} />
  ) : (
    <TextLayoutWeb toolbar={<LikutToolbarWeb />} />
  );
};

export default LikutContainer;

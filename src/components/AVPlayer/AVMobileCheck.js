import React, { useContext, memo } from 'react';

import AVPlayerMobile from './AVPlayerMobile';
import AVPlayer from './AVPlayer';
import { DeviceInfoContext } from "../../helpers/app-contexts";
import { areEqual } from '../../helpers/utils';

const AVMobileCheck = (props) => {
  const { autoPlayAllowed } = useContext(DeviceInfoContext);
  return autoPlayAllowed
    ? <AVPlayer {...props} />
    : <AVPlayerMobile {...props} />;
};

export default memo(AVMobileCheck, areEqual);

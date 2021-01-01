import React, { useContext } from 'react';

import AVPlayerMobile from './AVPlayerMobile';
import AVPlayer from './AVPlayer';
import { DeviceInfoContext } from "../../helpers/app-contexts";

const AVMobileCheck = (props) => {
  const { undefinedDevice } = useContext(DeviceInfoContext);
  return undefinedDevice
    ? <AVPlayer {...props} />
    : <AVPlayerMobile {...props} />;
};

export default AVMobileCheck;

import React, { useContext } from 'react';

import AVPlayerMobile from './AVPlayerMobile';
import AVPlayer from './AVPlayer';
import { ClientChroniclesContext, DeviceInfoContext } from "../../helpers/app-contexts";

const AVMobileCheck = props => {
  const deviceInfoContext = useContext(DeviceInfoContext);
  const chronicles = useContext(ClientChroniclesContext);
  return deviceInfoContext.undefinedDevice
    ? <AVPlayer {...props} chronicles={chronicles} />
    : <AVPlayerMobile {...props} chronicles={chronicles} />;
};

export default AVMobileCheck;

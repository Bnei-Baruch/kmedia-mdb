import React, { useContext } from 'react';

import AVPlayerMobile from './AVPlayerMobile';
import AVPlayer from './AVPlayer';
import { DeviceInfoContext } from "../../helpers/app-contexts";

const AVMobileCheck = (props) => {
  const { autoPlayAllowed } = useContext(DeviceInfoContext);
  return autoPlayAllowed
    ? <AVPlayer {...props} />
    : <AVPlayerMobile {...props} />;
};

// withMediaProps is here to make the changes in the media context
// to propagate correctly through this component
export default AVMobileCheck;

import React from 'react';
import { useSelector } from 'react-redux';
import { withMediaProps } from 'react-media-player';

import { selectors as device } from '../../redux/modules/device';
import AVPlayerMobile from './AVPlayerMobile';
import AVPlayer from './AVPlayer';

const AVMobileCheck = (props) => {
  const deviceInfo = useSelector(state => device.getDeviceInfo(state.device));
  const autoPlayAllowed = useSelector(state => device.getAutoPlayAllowed(state.device));

  return autoPlayAllowed 
    ? <AVPlayer {...props} /> 
    : <AVPlayerMobile {...props} />;
};

// withMediaProps is here to make the changes in the media context
// to propagate correctly through this component
export default withMediaProps(AVMobileCheck);

import React from 'react';
import { withMediaProps } from 'react-media-player';
import AVPlayerMobile from './AVPlayerMobile';
import AVPlayer from './AVPlayer';

const AVMobileCheck = (props) => {
  return props.autoPlayAllowed
    ? <AVPlayer {...props} />
    : <AVPlayerMobile {...props} />;
};

// withMediaProps is here to make the changes in the media context
// to propagate correctly through this component
export default withMediaProps(AVMobileCheck);

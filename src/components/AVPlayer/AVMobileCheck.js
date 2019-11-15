import React from 'react';
import PropTypes from 'prop-types';

import AVPlayerMobile from './AVPlayerMobile';
import AVPlayer from './AVPlayer';

const AVMobileCheck = (props) => {
  return props.autoPlayAllowed
    ? <AVPlayer {...props} />
    : <AVPlayerMobile {...props} />;
};

AVMobileCheck.propTypes = {
  autoPlayAllowed: PropTypes.bool.isRequired,
};

// withMediaProps is here to make the changes in the media context
// to propagate correctly through this component
export default AVMobileCheck;

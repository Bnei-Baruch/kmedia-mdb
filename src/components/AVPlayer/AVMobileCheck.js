import React from 'react';
import PropTypes from 'prop-types';

import withIsMobile from '../../helpers/withIsMobile';
import AVPlayerMobile from './AVPlayerMobile';
import AVPlayer from './AVPlayer';

const AVMobileCheck = props => (
  props.isMobileDevice ?
    <AVPlayerMobile {...props} /> :
    <AVPlayer {...props} />
);

AVMobileCheck.propTypes = {
  isMobileDevice: PropTypes.bool.isRequired,
};

export default withIsMobile(AVMobileCheck);

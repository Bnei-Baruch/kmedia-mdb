import React from 'react';
import PropTypes from 'prop-types';

import withIsMobile from '../../helpers/withIsMobile';
import * as shapes from '../shapes';
import AVPlayerMobile from './AVPlayerMobile';
import AVPlayer from './AVPlayer';

const AVMobileCheck = props => (
  props.isMobileDevice ?
    <AVPlayerMobile {...props} /> :
    <AVPlayer {...props} />
);

AVMobileCheck.propTypes = {
  isMobileDevice: PropTypes.bool.isRequired,
  uaParser: shapes.UserAgentParserResults.isRequired,
};

export default withIsMobile(AVMobileCheck);

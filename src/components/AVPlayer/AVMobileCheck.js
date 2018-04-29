import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMediaProps } from 'react-media-player';

import { selectors as device } from '../../redux/modules/device';
import * as shapes from '../shapes';
import AVPlayerMobile from './AVPlayerMobile';
import AVPlayer from './AVPlayer';

const AVMobileCheck = props => (
  props.autoPlayAllowed ?
    <AVPlayer {...props} /> :
    <AVPlayerMobile {...props} />
);

AVMobileCheck.propTypes = {
  deviceInfo: shapes.UserAgentParserResults.isRequired,
  autoPlayAllowed: PropTypes.bool.isRequired,
};

const mapState = state => ({
  deviceInfo: device.getDeviceInfo(state.device),
  autoPlayAllowed: device.getAutoPlayAllowed(state.device),
});

// withMediaProps is here to make the changes in the media context
// to propagate correctly through this component
export default withMediaProps(connect(mapState)(AVMobileCheck));

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMediaProps } from 'react-media-player';

import { selectors as system } from '../../redux/modules/system';
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
  deviceInfo: system.getDeviceInfo(state.system),
  autoPlayAllowed: system.getAutoPlayAllowed(state.system),
});

// withMediaProps is here to make the changes in the media context
// to propagate correctly through this component
export default withMediaProps(connect(mapState)(AVMobileCheck));

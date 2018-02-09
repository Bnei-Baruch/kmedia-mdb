import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import withIsMobile from '../../helpers/withIsMobile';
import AVPlayerMobile from './AVPlayerMobile';
import AVPlayer from './AVPlayer';

const AVMobileCheck = (props) => {
  return props.isMobileDevice ? <AVPlayerMobile {...props} /> : <AVPlayer {...props} />;
};

AVMobileCheck.propTypes = {
  t: PropTypes.func.isRequired,

  // Language dropdown props.
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  language: PropTypes.string.isRequired,
  onLanguageChange: PropTypes.func.isRequired,

  // Audio/Video switch props.
  item: PropTypes.object.isRequired, // TODO: (yaniv) add shape fo this
  onSwitchAV: PropTypes.func.isRequired,

  // Playlist props
  autoPlay: PropTypes.bool,
  showNextPrev: PropTypes.bool,
  hasNext: PropTypes.bool,
  hasPrev: PropTypes.bool,
  onFinish: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  isMobile: PropTypes.bool.isRequired,
};

AVMobileCheck.defaultProps = {
  autoPlay: false,
  showNextPrev: false,
  hasNext: false,
  hasPrev: false,
  onFinish: noop,
  onPlay: noop,
  onPause: noop,
  onPrev: noop,
  onNext: noop,
};
export default withIsMobile(AVMobileCheck);

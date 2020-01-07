import React from 'react';
import PropTypes from 'prop-types';
import { formatTime } from '../../helpers/time';

const AVDuration = ({ duration = undefined }) => <time>{formatTime(duration)}</time>;

AVDuration.propTypes = {
  duration: PropTypes.number,
};

export default React.memo(AVDuration);

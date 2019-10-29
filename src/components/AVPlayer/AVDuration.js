import React from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import { formatTime } from '../../helpers/time';

const AVDuration = ({ name = undefined, value = undefined, media }) => {
  const time = typeof value !== 'undefined' ? value : media[name];

  return (
    <time>{formatTime(time)}</time>
  );
};

AVDuration.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  media: PropTypes.object.isRequired,
};

export default withMediaProps(AVDuration);

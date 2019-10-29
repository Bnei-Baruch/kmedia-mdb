import React from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import { Icon } from 'semantic-ui-react';

const AVJumpBack = ({ jumpSpan = 5, media: { duration, currentTime, seekTo } }) => {
  const onJumpBack = () => {
    let jumpTo = currentTime + jumpSpan;

    // Make sure we don't exceed the duration boundaries
    jumpTo = Math.max(0, Math.min(jumpTo, duration));

    seekTo(jumpTo);
  };

  const isBack = () => jumpSpan < 0;

  const backwardText = jumpSpan < 0 ? `${jumpSpan}s` : '';
  const farwardText  = jumpSpan > 0 ? `+${jumpSpan}s` : '';

  return (
    <button type="button" tabIndex="-1" onClick={onJumpBack}>
      {backwardText}
      <Icon name={isBack() ? 'backward' : 'forward'} />
      {farwardText}
    </button>
  );
};

AVJumpBack.propTypes = {
  media: PropTypes.shape({
    currentTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    seekTo: PropTypes.func.isRequired,
  }).isRequired,
  jumpSpan: PropTypes.number,
};

export default withMediaProps(AVJumpBack);

import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

const AVJumpBack = ({ jumpSpan = 5, getMedia }) => {
  const onJumpBack = () => {
    const { duration, currentTime, seekTo } = getMedia();
    let jumpTo = currentTime + jumpSpan;

    // Make sure we don't exceed the duration boundaries
    jumpTo = Math.max(0, Math.min(jumpTo, duration));

    seekTo(jumpTo);
  };

  const isBack = jumpSpan < 0;

  const backwardText = isBack ? `${jumpSpan}s` : '';
  const forwardText  = !isBack ? `+${jumpSpan}s` : '';

  return (
    <button type="button" tabIndex="-1" onClick={onJumpBack}>
      {backwardText}
      <Icon name={isBack ? 'backward' : 'forward'} />
      {forwardText}
    </button>
  );
};

AVJumpBack.propTypes = {
  getMedia: PropTypes.func,
  jumpSpan: PropTypes.number,
};

export default React.memo(AVJumpBack);

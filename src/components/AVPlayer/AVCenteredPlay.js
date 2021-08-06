import React, { memo, useCallback } from 'react';
import { Icon } from 'semantic-ui-react';
import clsx from 'clsx';

const AVCenteredPlay = ({ media: { isPlaying, isLoading, playPause } }) => {
  const isHidden        = isPlaying || isLoading;
  const handlePlayPause = useCallback(() => {
    if (!isLoading) {
      playPause();
    }
  }, [isLoading, playPause]);

  return (
    <button
      type="button"
      tabIndex="-1"
      className={clsx('mediaplayer__onscreen-play', { transparent: isHidden })}
      onClick={() => handlePlayPause()}
    >
      <Icon name="play" size="huge" />
    </button>
  );
};

export default memo(AVCenteredPlay, (prevProps, nextProps) => {
  const { media: pMedia } = prevProps;
  const { media: nMedia } = nextProps;

  return nMedia.isPlaying === pMedia.isPlaying
    && nMedia.isLoading === pMedia.isLoading;
});


import React, { memo, useCallback } from 'react';
import { Icon } from 'semantic-ui-react';

const AVPlayPause = ({
  media,
  showNextPrev = null,
  hasNext = null,
  hasPrev = null,
  onNext = null,
  onPrev = null,
  withoutPlay = false,
}) => {
  const handlePlayPause = useCallback(() => {
    if (!media.isLoading) {
      media.playPause();
    }
  }, [media]);

  return (
    <div className="buttons-wrapper">
      {
        showNextPrev && (
          <button
            type="button"
            tabIndex="-1"
            disabled={!hasPrev}
            onClick={onPrev}
          >
            <Icon name="step backward" disabled={!hasPrev} />
          </button>
        )
      }
      {
        !withoutPlay && (
          <button
            onClick={() => handlePlayPause()}
            type="button"
            tabIndex="-1"
          >
            <Icon name={media.isPlaying ? 'pause' : 'play'} />
          </button>
        )}
      {
        showNextPrev && (
          <button
            type="button"
            tabIndex="-1"
            disabled={!hasNext}
            onClick={onNext}
          >
            <Icon name="step forward" disabled={!hasNext} />
          </button>
        )
      }
    </div>
  );
};

export default memo(AVPlayPause, (prevProps, nextProps) => {
  const { media, hasNext, hasPrev, showNextPrev } = prevProps;
  return nextProps.media.isPlaying === media.isPlaying
    && nextProps.hasNext === hasNext
    && nextProps.hasPrev === hasPrev
    && nextProps.showNextPrev === showNextPrev;
});

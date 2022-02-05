import React from 'react';
import { Audio, Video } from '@vime/react';

const video = (source, poster) => (
  <Video crossOrigin autoPiP poster={poster}>
    <source data-src={source} type="video/mp4" />
  </Video>
);

const audio = source => (
  <Audio>
    <source data-src={source} type="audio/mp3" />
  </Audio>
);

export const VmProvider = ({ isVideo, poster, source }) => {
  const provider = isVideo ? video : audio;
  return provider(source, poster);
};

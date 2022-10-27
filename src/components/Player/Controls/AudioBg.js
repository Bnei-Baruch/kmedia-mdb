import React from 'react';
import { useSelector } from 'react-redux';
import { MT_AUDIO } from '../../../helpers/consts';
import { selectors as playlistSelectors } from '../../../redux/modules/playlist';

const AudioBg = () => {
  const mediaType = useSelector(state => playlistSelectors.getInfo(state.playlist).mediaType);

  if (mediaType !== MT_AUDIO) return null;
  return (
    <div className="controls__bg_audio"></div>
  );
};

export default AudioBg;

import React from 'react';
import { useSelector } from 'react-redux';
import { MT_AUDIO } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/player';

const AudioBg = () => {
  const { type } = useSelector(state => selectors.getFile(state.player));
  if (type !== MT_AUDIO) return null;
  return (
    <div className="controls__bg_audio"></div>
  );
};

export default AudioBg;

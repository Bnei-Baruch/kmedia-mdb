import React from 'react';
import { useSelector } from 'react-redux';
import { MT_AUDIO } from '../../helpers/consts';
import { playerGetFileSelector } from '../../redux/selectors';

const AudioBg = () => {
  const { type } = useSelector(playerGetFileSelector) || false;
  if (type !== MT_AUDIO) return null;
  return (
    <div className="audio-backdrop">
      <span className="material-symbols-outlined text-5xl">volume_up</span>
    </div>
  );
};

export default AudioBg;

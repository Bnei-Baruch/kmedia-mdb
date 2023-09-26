import React from 'react';
import { useSelector } from 'react-redux';
import { MT_AUDIO } from '../../src/helpers/consts';
import { selectors } from '../redux/slices/playerSlice/playerSlice';
import { Icon } from 'semantic-ui-react';

const AudioBg = () => {
  const { type } = useSelector(state => selectors.getFile(state.player)) || false;
  if (type !== MT_AUDIO) return null;
  return (
    <div className="audio-backdrop">
      <Icon size="huge" name="volume up" />
    </div>
  );
};

export default AudioBg;

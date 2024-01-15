import React from 'react';
import { useSelector } from 'react-redux';
import { MT_AUDIO } from '../../helpers/consts';
import { Icon } from 'semantic-ui-react';
import { playerGetFileSelector } from '../../redux/selectors';

const AudioBg = () => {
  const { type } = useSelector(playerGetFileSelector) || false;
  if (type !== MT_AUDIO) return null;
  return (
    <div className="audio-backdrop">
      <Icon size="huge" name="volume up" />
    </div>
  );
};

export default AudioBg;

import React from 'react';
import { useSelector } from 'react-redux';
import { MT_AUDIO } from '../../helpers/consts';
import { selectors } from '../../redux/modules/player';
import { Icon } from 'semantic-ui-react';

const AudioBg = () => {
  const { type } = useSelector(state => selectors.getFile(state.player));
  if (type !== MT_AUDIO) return null;
  return (
    <div className="audio-backdrop">
      <Icon size="huge" name="volume up" />
    </div>
  );
};

export default AudioBg;

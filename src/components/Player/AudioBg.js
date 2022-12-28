import React from 'react';
import { useSelector } from 'react-redux';
import { MT_AUDIO } from '../../helpers/consts';
import { selectors } from '../../redux/modules/player';
import { Icon } from 'semantic-ui-react';
import SvgAudio from '../../images/icons/Audio';

const AudioBg = () => {
  const { type } = useSelector(state => selectors.getFile(state.player));
  if (type !== MT_AUDIO) return null;
  return (
    <div className="audio_bg">
      <SvgAudio className="audio_icon" fill="#767676"  />
    </div>
  );
};

export default AudioBg;

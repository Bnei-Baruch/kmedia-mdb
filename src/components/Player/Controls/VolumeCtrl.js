import React, { useEffect, useRef, useState } from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { useSelector, shallowEqual } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { selectors as player } from '../../../redux/modules/player';
import { VolumeKnob } from './VolumeKnob';

const VolumeCtrl = ({ t }) => {
  const widthRef = useRef({});
  const isReady  = useSelector(state => player.isReady(state.player));

  const [volume, setVolume] = useState(isReady && window.jwplayer().getVolume());
  const [mute, setMute]     = useState(isReady && window.jwplayer().getMute());
  const [left, setLeft]     = useState();
  const [right, setRight]   = useState();

  const icon = mute ? 'off' : volume < 40 ? 'down' : 'up';

  //recount position on resize
  const width = useSelector(state => player.getPlayerWidth(state.player), shallowEqual);

  useEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [widthRef.current, width]);

  useEffect(() => {
    if (!isReady) return () => null;

    const updateVolume = ({ volume }) => setVolume(volume);
    const updateMute   = ({ mute }) => setMute(mute);

    const p = window.jwplayer();
    p.on('volume', updateVolume);
    p.on('mute', updateMute);
    setVolume(p.getVolume());

    return () => {
      p.off('volume', updateVolume);
      p.off('mute', updateMute);
    };
  }, [isReady]);

  useEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [widthRef.current]);

  const handleMute = () => window.jwplayer().setMute();

  return (
    <div className="controls__volume">
      <Popup content={t('player.controls.mute')} inverted size="mini" position="top center" trigger={
        <div className="controls__volume-icon" onClick={handleMute}>
          <Icon fitted name={`volume ${icon}`} />
        </div>
      } />
      <div className="controls__slider">
        <div className="slider__wrapper" ref={widthRef}>
          <div
            style={{ width: `${volume}%` }}
            className="slider__value"
          ></div>
          <VolumeKnob left={left} right={right + 120} />
        </div>
      </div>
    </div>
  );
};

export default withNamespaces()(VolumeCtrl);

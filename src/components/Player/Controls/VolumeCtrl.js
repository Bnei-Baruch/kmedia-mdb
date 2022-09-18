import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { VolumeKnob } from './VolumeKnob';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../../redux/modules/player';
import isFunction from 'lodash/isFunction';

export const VolumeCtrl = () => {
  const widthRef = useRef({});
  const isReady  = useSelector(state => player.isReady(state.player));

  const [volume, setVolume] = useState(0);
  const [left, setLeft]     = useState();
  const [right, setRight]   = useState();

  const updateVolume = useCallback(({ volume }) => setVolume(volume), [setVolume]);
  const isMuted      = isFunction(window.jwplayer()?.getMute) ? window.jwplayer()?.getMute() : false;
  const icon         = isMuted ? 'off' : volume < 40 ? 'down' : 'up';

  useEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [widthRef.current]);

  useEffect(() => {
    if (!isReady) return () => null;

    const p = window.jwplayer();
    p.on('volume', updateVolume);

    return () => p.off('volume', updateVolume);
  }, [isReady]);

  useEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [widthRef.current]);

  const handleMute = () => window.jwplayer().setMute();

  return (
    <div className="controls__volume">
      <Popup content="Mute" inverted size="mini" position="top center" trigger={
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

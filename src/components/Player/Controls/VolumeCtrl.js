import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { useSelector, shallowEqual } from 'react-redux';
import isFunction from 'lodash/isFunction';
import { withNamespaces } from 'react-i18next';

import { selectors as player } from '../../../redux/modules/player';
import { VolumeKnob } from './VolumeKnob';

const VolumeCtrl = ({ t }) => {
  const widthRef = useRef({});
  const isReady  = useSelector(state => player.isReady(state.player));

  const [volume, setVolume] = useState(isReady && window.jwplayer().getVolume());
  const [left, setLeft]     = useState();
  const [right, setRight]   = useState();

  const updateVolume = useCallback(({ volume }) => setVolume(volume), [setVolume]);
  const isMuted      = isFunction(window.jwplayer()?.getMute) ? window.jwplayer()?.getMute() : false;
  const icon         = isMuted ? 'off' : volume < 40 ? 'down' : 'up';

  //recount position on resize
  const width = useSelector(state => player.getPlayerWidth(state.player), shallowEqual);

  useEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [widthRef.current, width]);

  useEffect(() => {
    if (!isReady) return () => null;

    const p = window.jwplayer();
    p.on('volume', updateVolume);
    setVolume(p.getVolume());

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

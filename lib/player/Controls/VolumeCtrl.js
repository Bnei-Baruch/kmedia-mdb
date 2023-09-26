import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Icon } from 'semantic-ui-react';
import { useSelector, shallowEqual } from 'react-redux';
import { withTranslation } from 'next-i18next';

import { selectors as player } from '../../redux/slices/playerSlice/playerSlice';
import { VolumeKnob } from './VolumeKnob';
import WebWrapTooltip from '../../../src/components/shared/WebWrapTooltip';
import { useSubscribeVolume } from '../../../pkg/jwpAdapter';
import { setMute, setVolume } from '../../../pkg/jwpAdapter/adapter';

const VolumeCtrl = ({ t }) => {
  const widthRef = useRef({});

  const [left, setLeft]   = useState();
  const [right, setRight] = useState();

  const isMuted = useSelector(state => player.isMuted(state.player));
  //recount position on resize
  const width   = useSelector(state => player.getPlayerWidth(state.player), shallowEqual);
  const volume  = useSubscribeVolume();

  const icon = isMuted ? 'off' : volume < 40 ? 'down' : 'up';

  useEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right + 120);
  }, [widthRef, width]);

  const onChangePosition = useCallback(e => {
    e.preventDefault();

    // Resolve clientX from mouse or touch event.
    const clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
    const delta   = right - left;
    const v       = Math.round(100 * Math.min(Math.max(0, clientX - left), delta) / delta);
    setVolume(v);
  }, [left, right]);

  const handleMute = () => setMute(!isMuted);

  return (
    <div className="controls__volume">
      <WebWrapTooltip
        content={t('player.controls.mute')}
        trigger={
          <div className="controls__volume-icon" onClick={handleMute}>
            <Icon fitted name={`volume ${icon}`} />
          </div>
        }
      />
      <div className="controls__slider">
        <div
          className="slider__wrapper"
          ref={widthRef}
          onClick={onChangePosition}
        >
          <div
            style={{ width: `${isMuted ? 0 : volume}%` }}
            className="slider__value"
          ></div>
          <VolumeKnob onChangePosition={onChangePosition} />
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(VolumeCtrl);

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { VolumeKnob } from './VolumeKnob';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { useSubscribeVolume } from '../../../pkg/jwpAdapter';
import { setMute, setVolume } from '../../../pkg/jwpAdapter/adapter';
import { playerGetPlayerWidthSelector, playerIsMutedSelector } from '../../../redux/selectors';

const VolumeCtrl = () => {
  const { t } = useTranslation();
  const widthRef = useRef({});

  const [left, setLeft]   = useState();
  const [right, setRight] = useState();

  const isMuted = useSelector(playerIsMutedSelector);
  const width   = useSelector(playerGetPlayerWidthSelector, shallowEqual);
  const volume  = useSubscribeVolume();

  const icon = isMuted ? 'off' : volume < 40 ? 'down' : 'up';

  useEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right + 120);
  }, [widthRef, width]);

  const onChangePosition = useCallback(e => {
    e.preventDefault();

    const clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
    const delta   = right - left;
    const v       = Math.round(100 * Math.min(Math.max(0, clientX - left), delta) / delta);
    setVolume(v);
  }, [left, right]);

  const handleMute = () => setMute(!isMuted);

  return (
    <div className="controls__volume">
      <div className="controls__volume-icon">
        <WebWrapTooltip
          content={t('player.controls.mute')}
          trigger={
            <div onClick={handleMute}>
              <div className="material-symbols-outlined">{`volume_${icon}`}</div>
            </div>
          }
        />
      </div>
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
          <VolumeKnob onChangePosition={onChangePosition}/>
        </div>
      </div>
    </div>
  );
};

export default VolumeCtrl;

import React, { useEffect, useRef, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { useSelector, shallowEqual } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { selectors as player } from '../../../redux/modules/player';
import { VolumeKnob } from './VolumeKnob';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { useSubscribeVolume } from '../../../pkg/jwpAdapter';
import { setMute } from '../../../pkg/jwpAdapter/adapter';

const VolumeCtrl = ({ t }) => {
  const widthRef = useRef({});

  const [left, setLeft]   = useState();
  const [right, setRight] = useState();

  //recount position on resize
  const width            = useSelector(state => player.getPlayerWidth(state.player), shallowEqual);
  const { volume, mute } = useSubscribeVolume();

  const icon = mute ? 'off' : volume < 40 ? 'down' : 'up';

  useEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [widthRef.current, width]);

  useEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [widthRef.current]);

  const handleMute = () => setMute();

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

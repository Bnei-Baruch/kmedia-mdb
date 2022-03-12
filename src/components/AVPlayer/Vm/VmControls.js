import React, { useContext } from 'react';
import isNumber from 'lodash/isNumber';
import {
  ClickToPlay,
  DblClickFullscreen,
  ControlGroup,
  Controls,
  ControlSpacer,
  FullscreenControl,
  LoadingScreen,
  PipControl,
  PlaybackControl,
  Poster,
  Scrim,
  ScrubberControl,
  Skeleton,
  Spinner,
  TimeProgress,
  VolumeControl,
} from '@vime/react';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { VmJump } from './VmJump';
import { VmAudioVideo, VmPrevNext, VmSettingsButton, VmShareButton } from './VmControlButton';

const toPercentage = l => {
  const ret = 100 * l;
  if (ret > 100) {
    return '100%';
  }

  return (ret < 1) ? 0 : `${ret}%`;
};

const getSeekBar = (sliceStart, sliceEnd, duration) => {
  const isSlice = isNumber(sliceStart) && isNumber(sliceEnd);

  if (isSlice) {
    if (sliceStart > sliceEnd) {
      sliceStart = sliceEnd;
    }

    if (duration < sliceStart) {
      sliceStart = duration;
    }

    if (sliceStart < 0) {
      sliceStart = 0;
    }

    if (sliceEnd > duration) {
      sliceEnd = duration;
    }

    if (sliceEnd < 0) {
      sliceEnd = 0;
    }
  }

  return (
    <ControlGroup>
      { // slice marker
        (isSlice && duration > 0) &&
          <div
            className="seekbar__bar is-slice"
            style= {{
              left: toPercentage(sliceStart / duration),
              width: toPercentage((sliceEnd - sliceStart) / duration)
            }}>
          </div>
      }
      <ScrubberControl
        alwaysShowHours
        style={{ '--vm-slider-track-height': '3px',
          '--vm-slider-track-focused-height': '5px',
          '--vm-slider-thumb-height': '10px',
          '--vm-slider-thumb-width': '10px'
        }}
      />;
    </ControlGroup>
  );
}

const getVideoControls = () => (
  <>
    <PipControl />
    <FullscreenControl hideTooltip />
  </>
)

const getControls = (isMobileDevice, onActivateSlice, onActivateSettings, isVideo, onSwitchAV,  sliceStart, sliceEnd, duration) =>
  <ControlGroup>
    <PlaybackControl />
    <VolumeControl className="volumeControl" />
    <TimeProgress hideTooltip />
    { !isMobileDevice && <ControlSpacer hideTooltip /> }
    { isMobileDevice && <VmAudioVideo isVideo={isVideo} onSwitchAV={onSwitchAV} /> }
    { isVideo && getVideoControls()}
    <VmSettingsButton onClick={onActivateSettings} />
    <VmShareButton onClick={onActivateSlice} />
  </ControlGroup>;


export const VmControls = (
  {
    isVideo,
    onSwitchAV, onActivateSlice, onActivateSettings,
    sliceStart, sliceEnd, duration,
    showNextPrev, onPrev, onNext,
  }
) =>  {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  return (
    <>
      {/* video ui */}
      { isVideo &&
        <>
          <Scrim gradient="up" />
          <Poster />
          <Skeleton />
          <ClickToPlay />
          <DblClickFullscreen />
        </>
      }

      {/* generic  */}
      <Spinner />
      <LoadingScreen />

      {/* Jump & Next */}
      <Controls pin="center" justify='space-around' hideOnMouseLeave>
        { showNextPrev && <VmPrevNext isPrev onClick={onPrev} /> }
        <VmJump isBack={true} />
        <ControlSpacer />
        { isVideo && <PlaybackControl hideTooltip style={{ '--vm-control-scale': 3 }} /> }
        <ControlSpacer />
        <VmJump isBack={false} />
        { showNextPrev && <VmPrevNext isPrev={false} onClick={onNext} /> }
      </Controls>

      <Controls pin="bottomLeft" fullWidth hideOnMouseLeave justify="space-evenly">
        {getSeekBar(sliceStart, sliceEnd, duration)}
        {getControls(isMobileDevice, onActivateSlice, onActivateSettings, isVideo, onSwitchAV,  sliceStart, sliceEnd, duration)}
      </Controls>
    </>
  )
};

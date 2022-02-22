import React from 'react';
import isNumber from 'lodash/isNumber';
import {
  ClickToPlay,
  DblClickFullscreen,
  ControlGroup,
  Controls,
  ControlSpacer,
  CurrentTime,
  EndTime,
  FullscreenControl,
  LoadingScreen,
  PipControl,
  PlaybackControl,
  Poster,
  Scrim,
  ScrubberControl,
  SettingsControl,
  Skeleton,
  Spinner,
  TimeProgress,
  VolumeControl,
} from '@vime/react';
import { VmJump } from './VmJump';
import {VmAudioVideo, VmPrevNext, VmSettingsButton, VmShareButton } from './VmControlButton';

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
          <div className="seekbar__bar is-slice" style= {{
            left: toPercentage(sliceStart / duration),
            width: toPercentage((sliceEnd - sliceStart) / duration)
          }}>
          </div>
      }
      <ScrubberControl
        alwaysShowHours
        style={{ '--vm-slider-track-height': '4px' }}
      />;
    </ControlGroup>
  );
}

const getControls = (onActivateSlice, onActivateSettings, isVideo, onSwitchAV) =>
  <ControlGroup>
    <PlaybackControl />
    <VolumeControl className="volumeControl" />
    <TimeProgress hideTooltip />
    <ControlSpacer hideTooltip />
    <VmAudioVideo isVideo={isVideo} onSwitchAV={onSwitchAV} />
    {/* <SettingsControl /> */}
    { isVideo && getVideoControls()}
    <VmSettingsButton onClick={onActivateSettings} />
    <VmShareButton onClick={onActivateSlice} />
  </ControlGroup>;


const getVideoControls = () => (
  <>
    <PipControl />
    <FullscreenControl hideTooltip />
  </>
)

const buildMobileVideoControls = (sliceStart, sliceEnd, duration) => (
  <>
    <Scrim gradient="up" />
    <Controls
      pin="topLeft"
      fullWidth
    >
      <ControlSpacer />
      <VolumeControl />
      <SettingsControl />
      <FullscreenControl />
    </Controls>

    <Controls
      pin="center"
      justify="center"
    >
      <PlaybackControl hideTooltip style={{ '--vm-control-scale': 1.3 }} />
    </Controls>

    <Controls
      pin="bottomLeft"
      fullWidth
    >
      <ControlGroup>
        <CurrentTime />
        <ControlSpacer />
        <EndTime />
        <FullscreenControl />
      </ControlGroup>

      {getSeekBar(sliceStart, sliceEnd, duration)}
    </Controls>
  </>
);

const buildDesktopVideoUi = (isVideo, showNextPrev, onPrev, onNext, onSwitchAV, onActivateSlice, onActivateSettings, sliceStart, sliceEnd, duration) => (
  <>
    {/* video ui */}
    { isVideo &&
      <>
        <Scrim gradient="up" />
        <Poster />
        <Skeleton />
        <DblClickFullscreen />
      </>
    }

    {/* generic  */}
    <ClickToPlay />
    <Spinner />
    <LoadingScreen />

    <Controls pin="center" justify='space-around' hideOnMouseLeave={true}>
      { showNextPrev && <VmPrevNext isPrev onClick={onPrev} /> }
      <VmJump isBack={true} />
      <ControlSpacer />
      <VmJump isBack={false} />
      { showNextPrev && <VmPrevNext isPrev={false} onClick={onNext} /> }
    </Controls>

    <Controls pin="bottomLeft" fullWidth hideOnMouseLeave={true}>
      {getSeekBar(sliceStart, sliceEnd, duration)}
      {getControls(onActivateSlice, onActivateSettings, isVideo, onSwitchAV)}
    </Controls>
  </>
);

const buildAudioControls = (onSwitchAV, onActivateSlice, sliceStart, sliceEnd, duration) => (
  <Controls fullWidth>
    <ClickToPlay />
    {/* <Poster /> */}
    {getSeekBar(sliceStart, sliceEnd, duration)}
    {getControls(onActivateSlice, false, onSwitchAV)}
  </Controls>
);


export const VmControls = (
  {
    isMobile, isVideo,
    onSwitchAV, onActivateSlice, onActivateSettings,
    sliceStart, sliceEnd, duration,
    showNextPrev, onPrev, onNext,
  }
) =>  {
  let controls;

  // if (isMobile) {
  //   controls = buildMobileVideoControls();
  // } else if (isVideo) {
  controls = buildDesktopVideoUi(isVideo, showNextPrev, onPrev, onNext, onSwitchAV, onActivateSlice, onActivateSettings, sliceStart, sliceEnd, duration);
  // } else {
  //   controls = buildAudioControls(showNextPrev, onPrev, onNext, onSwitchAV, onActivateSlice, sliceStart, sliceEnd, duration);
  // }

  return controls;
};


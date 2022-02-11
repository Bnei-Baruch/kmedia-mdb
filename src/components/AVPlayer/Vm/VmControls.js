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
import { VmPrevNext } from './VmPrevNext';
import { VmJump } from './VmJump';
import VmAudioVideo from './VmAudioVideo';
import { VmShareButton } from './VmShareButton';

const toPercentage = l => {
  const ret = 100 * l;
  if (ret > 100) {
    return '100%';
  }

  return (ret < 1) ? 0 : `${ret}%`;
};

const getSeekBar = (sliceStart, sliceEnd, duration) => {
  // console.log('scrubber:', sliceStart, sliceEnd, duration)
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

const getControls = (onActivateSlice, isVideo, onSwitchAV) =>
  <ControlGroup>
    <PlaybackControl />
    <VolumeControl className="volumeControl" />
    <TimeProgress hideTooltip />
    <ControlSpacer hideTooltip />
    <VmAudioVideo isVideo={isVideo} onSwitchAV={onSwitchAV} />
    <SettingsControl />
    { isVideo && getVideoControls()}
    <VmShareButton onActivateSlice={onActivateSlice} />
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

const buildDesktopVideoUi = (isVideo, showNextPrev, onPrev, onNext, onSwitchAV, onActivateSlice, sliceStart, sliceEnd, duration) => (
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
      {/* <PlaybackControl
        hideTooltip
        style={{
          '--vm-control-scale': 1.3,
          backgroundColor: 'rgba(24, 26, 27, 0.9)',
          color: 'rgb(214, 211, 205)',
          border: '3px solid rgb(214, 211, 205)',
          borderRadius: '50%',
          padding: '4px',
        }}
      />
      <ControlSpacer /> */}
      <VmJump isBack={false} />
      { showNextPrev && <VmPrevNext isPrev={false} onClick={onNext} /> }
    </Controls>

    <Controls pin="bottomLeft" fullWidth hideOnMouseLeave={true} style={{ '--vm-control-spacing': 0, }}>
      {getSeekBar(sliceStart, sliceEnd, duration)}
      {getControls(onActivateSlice, isVideo, onSwitchAV)}
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
    onSwitchAV, onActivateSlice,
    sliceStart, sliceEnd, duration,
    showNextPrev, onPrev, onNext,
  }
) =>  {
  let controls;

  // if (isMobile) {
  //   controls = buildMobileVideoControls();
  // } else if (isVideo) {
  controls = buildDesktopVideoUi(isVideo, showNextPrev, onPrev, onNext, onSwitchAV, onActivateSlice, sliceStart, sliceEnd, duration);
  // } else {
  //   controls = buildAudioControls(showNextPrev, onPrev, onNext, onSwitchAV, onActivateSlice, sliceStart, sliceEnd, duration);
  // }

  return controls;
};


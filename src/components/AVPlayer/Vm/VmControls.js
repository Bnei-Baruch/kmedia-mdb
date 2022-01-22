import React from 'react';
import {
  ClickToPlay,
  DblClickFullscreen,
  ControlGroup,
  Controls,
  ControlSpacer,
  CurrentTime,
  EndTime,
  FullscreenControl,
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
// import VmSeekBar from './VmSeekBar';
import { VmShareButton } from './VmShareButton';

const getVideoControls = () => (
  <>
    <PipControl />
    <FullscreenControl hideTooltip />
  </>
)

const seekBarFocus = () => {
  console.log('seekBarFocus')
}

const getSeekBar = (sliceStart, sliceEnd) =>
  // <VmSeekBar sliceStart={sliceStart} sliceEnd={sliceEnd} />;
  <ControlGroup>
    <ScrubberControl
      alwaysShowHours
      min={sliceStart}
      max={sliceEnd}
      vmFocus={seekBarFocus}
      // style={{
      //   '--vm-slider-track-height': 7,
      //   '--vm-slider-track-focused-height':7,
      //   // '--vm-scrubber-buffered-bg': 'red',
      //   // '--vm-scrubber-loading-stripe-color': 'gray'
      //   '--vm-slider-thumb-height': 7,
      //   // '--vm-slider-thumb-bg': 'orange'
      //   // '--vm-slider-track-color': 'yellow'
      // }}
    />;
  </ControlGroup>

const getControls = (showNextPrev, onPrev, onNext, onActivateSlice, isVideo, onSwitchAV) =>
  <ControlGroup space="both">
    { showNextPrev && <VmPrevNext isPrev onClick={onPrev} /> }
    <PlaybackControl />
    <VolumeControl className="volumeControl" />
    { showNextPrev && <VmPrevNext isPrev={false} onClick={onNext} /> }
    <TimeProgress hideTooltip />
    <VmJump />
    <ControlSpacer hideTooltip />
    <VmAudioVideo isVideo={isVideo} onSwitchAV={onSwitchAV} />
    <SettingsControl />
    { isVideo && getVideoControls()}
    <VmShareButton onActivateSlice={onActivateSlice} />
  </ControlGroup>;


const buildMobileVideoControls = () => (
  <>
    <Scrim gradient="up" />
    <Controls
      pin="topLeft"
      fullWidth
      // activeDuration={activeDuration}
      // waitForPlaybackStart={waitForPlaybackStart}
      // hideWhenPaused={hideWhenPaused}
    >
      <ControlSpacer />
      <VolumeControl />
      <SettingsControl />
      <FullscreenControl />
    </Controls>

    <Controls
      pin="center"
      justify="center"
      // activeDuration={activeDuration}
      // waitForPlaybackStart={waitForPlaybackStart}
      // hideWhenPaused={hideWhenPaused}
    >
      <PlaybackControl hideTooltip style={{ '--vm-control-scale': 1.3 }} />
    </Controls>

    <Controls
      pin="bottomLeft"
      fullWidth
      // activeDuration={activeDuration}
      // waitForPlaybackStart={waitForPlaybackStart}
      // hideWhenPaused={hideWhenPaused}
    >
      <ControlGroup>
        <CurrentTime />
        <ControlSpacer />
        <EndTime />
        <FullscreenControl />
      </ControlGroup>

      {getSeekBar()}
    </Controls>
  </>
);

const buildDesktopVideoControls = (showNextPrev, onPrev, onNext, onActivateSlice, onSwitchAV, sliceStart, sliceEnd) => (
  <>
    <Scrim gradient="up" />
    <ClickToPlay />
    <DblClickFullscreen />
    <Poster />
    <Spinner />
    <Skeleton />

    {/* <Controls fullWidth pin="topLeft">
      <ControlSpacer />
    </Controls> */}

    <Controls
      pin="center"
      justify="center"
    >
      {/*<VmBigPlay />*/}
      {/* TODO icon: padding-left: 2px; */}
      <PlaybackControl
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
    </Controls>

    <Controls
      pin="bottomLeft"
      fullWidth
      hideOnMouseLeave={true}
    >
      {getSeekBar(sliceStart, sliceEnd)}
      {/* <VmSeekBar sliceStart={sliceStart} sliceEnd={sliceEnd} />; */}
      {getControls(showNextPrev, onPrev, onNext, onActivateSlice, true, onSwitchAV)}
    </Controls>
  </>
);

const buildAudioControls = (onActivateSlice, showNextPrev, onPrev, onNext, onSwitchAV, sliceStart, sliceEnd) => (
  <Controls fullWidth>
    {/* <Scrim gradient="up" /> */}
    <ClickToPlay />
    <Poster />
    {getSeekBar(sliceStart, sliceEnd)}
    {/* <VmSeekBar sliceStart={sliceStart} sliceEnd={sliceEnd} />; */}
    {getControls(showNextPrev, onPrev, onNext, onActivateSlice, false, onSwitchAV)}
  </Controls>
);


export const VmControls = (
  {
    isMobile, isVideo,
    onSwitchAV,
    onActivateSlice, sliceStart, sliceEnd,
    showNextPrev, onPrev, onNext,
  }
) =>  {
  let controls;

  if (isMobile) {
    controls = buildMobileVideoControls();
  } else if (isVideo) {
    controls = buildDesktopVideoControls(showNextPrev, onPrev, onNext, onActivateSlice, onSwitchAV, sliceStart, sliceEnd);
  } else {
    controls = buildAudioControls(onActivateSlice, showNextPrev, onPrev, onNext, onSwitchAV, sliceStart, sliceEnd);
  }

  return controls;
};


import React from 'react';
import {
  ClickToPlay,
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
  Spinner,
  TimeProgress,
  VolumeControl,
} from '@vime/react';
import { VmPrevNext } from './VmPrevNext';
import { VmJump } from './VmJump';
import { VmAudioVideo } from './VmAudioVideo';
import { VmShare } from './VmShare';

const buildAudioControls = () => (
  <Controls fullWidth>
    <PlaybackControl keys={undefined} tooltipDirection="right" />
    <VolumeControl />
    <CurrentTime />
    <ScrubberControl alwaysShowHours />
    <EndTime />
    <SettingsControl tooltipDirection="left" />
  </Controls>
);

const buildMobileVideoControls = ({ activeDuration, waitForPlaybackStart, hideWhenPaused }) => (
  <>
    <Scrim gradient="up" />
    <Controls
      pin="topLeft"
      fullWidth
      activeDuration={activeDuration}
      waitForPlaybackStart={waitForPlaybackStart}
      hideWhenPaused={hideWhenPaused}
    >
      <ControlSpacer />
      <VolumeControl />
      <SettingsControl />
      <FullscreenControl />
    </Controls>

    <Controls
      pin="center"
      justify="center"
      activeDuration={activeDuration}
      waitForPlaybackStart={waitForPlaybackStart}
      hideWhenPaused={hideWhenPaused}
    >
      <PlaybackControl hideTooltip style={{ '--vm-control-scale': 1.3 }} />
    </Controls>

    <Controls
      pin="bottomLeft"
      fullWidth
      activeDuration={activeDuration}
      waitForPlaybackStart={waitForPlaybackStart}
      hideWhenPaused={hideWhenPaused}
    >
      <ControlGroup>
        <CurrentTime />
        <ControlSpacer />
        <EndTime />
        <FullscreenControl />
      </ControlGroup>

      <ControlGroup space="top">
        <ScrubberControl />
      </ControlGroup>
    </Controls>
  </>
);

const buildDesktopVideoControls = ({ activeDuration, waitForPlaybackStart, hideOnMouseLeave, showNextPrev, hasPrev, onPrev, hasNext, onNext, onActivateSlice }) => (
  <>
    <Scrim gradient="up" />
    <ClickToPlay />
    <Poster />
    <Spinner />

    <Controls fullWidth pin="topLeft">
      <ControlSpacer />
    </Controls>

    <Controls
      pin="center"
      justify="center"
      activeDuration={activeDuration}
      hideWhenPaused={false}
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
      activeDuration={activeDuration}
      waitForPlaybackStart={waitForPlaybackStart}
      hideWhenPaused={false}
      hideOnMouseLeave={hideOnMouseLeave}
    >
      <ControlGroup>
        <ScrubberControl alwaysShowHours />
      </ControlGroup>

      <ControlGroup space="top">
        {showNextPrev && (
          <VmPrevNext isPrev
            isDisabled={!hasPrev}
            onClick={onPrev}
          />
        )}
        <PlaybackControl
          hideTooltip
          style={{ '--vm-control-scale': 0.7, margin: '0 -1rem', }} />
        {showNextPrev && (
          <VmPrevNext isPrev={false}
            isDisabled={!hasNext}
            onClick={onNext}
          />
        )}
        <TimeProgress hideTooltip />
        <VmJump />
        <VolumeControl hideTooltip className="volumeControl" />
        <ControlSpacer hideTooltip />
        {/*<VmAudioVideo isVideo={isVideo} onSwitchAV={onSwitchAV} />*/}
        <PipControl hideTooltip />
        <SettingsControl hideTooltip />
        <VmShare onActivateSlice={onActivateSlice} />
        <FullscreenControl hideTooltip />
      </ControlGroup>
    </Controls>
  </>
);

export const VmControls = ({
  isMobile, isVideo,
  onSwitchAV,
  onActivateSlice,
  activeDuration, waitForPlaybackStart, hideWhenPaused, hideOnMouseLeave,
  showNextPrev, hasPrev, onPrev, hasNext, onNext,
}) => {
  let controls;

  if (isMobile) {
    controls = buildMobileVideoControls({ activeDuration, waitForPlaybackStart, hideWhenPaused });
  } else if (isVideo) {
    controls = buildDesktopVideoControls({
      activeDuration, waitForPlaybackStart, hideOnMouseLeave, showNextPrev, hasPrev, onPrev, hasNext, onNext, onActivateSlice,
    });
  } else {
    controls = buildAudioControls();
  }

  return controls;
};

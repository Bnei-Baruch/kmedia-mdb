import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { withRouter } from 'react-router-dom';
import { Player, withMediaProps } from 'react-media-player';
import classNames from 'classnames';
import { Icon } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { physicalFile } from '../../helpers/utils';
import { parse, stringify } from '../../helpers/url';
import { PLAYER_MODE } from './constants';
import AVPlayPause from './AVPlayPause';
import AVPlaybackRate from './AVPlaybackRate';
import AVCenteredPlay from './AVCenteredPlay';
import AVTimeElapsed from './AVTimeElapsed';
import AVFullScreen from './AVFullScreen';
import AVMuteUnmute from './AVMuteUnmute';
import AVLanguage from './AVLanguage';
import AVAudioVideo from './AVAudioVideo';
import AvSeekBar from './AvSeekBar';
import AVSliceToggle from './AVSliceToggle';
import AVSliceMenu from './AVSliceMenu';

// Converts playback rate string to float: 1.0x => 1.0
const playbackToValue = (playback) => {
  return parseFloat(playback.slice(0, -1))
};

class AVPlayerRMP extends PureComponent {

  static propTypes = {
    t: PropTypes.func.isRequired,
    media: PropTypes.object.isRequired,

    // Language dropdown props.
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultLanguage: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,

    // Audio/Video switch props.
    audio: shapes.MDBFile,
    video: shapes.MDBFile,
    active: shapes.MDBFile,
    onSwitchAV: PropTypes.func.isRequired,

    // Slice props
    isSliceable: PropTypes.bool,
    history: PropTypes.object.isRequired,

    // Playlist props
    autoPlay: PropTypes.bool,
    showNextPrev: PropTypes.bool,
    hasNext: PropTypes.bool,
    hasPrev: PropTypes.bool,
    onFinish: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
  };

  static defaultProps = {
    audio: null,
    video: null,
    active: null,

    isSliceable: false,

    autoPlay: false,
    showNextPrev: false,
    hasNext: false,
    hasPrev: false,
    onFinish: noop,
    onPlay: noop,
    onPause: noop,
    onPrev: noop,
    onNext: noop,
  };

  state = {
    controlsVisible: true,
    error: false,
    playbackRate: '1x', // this is used only to rerender the component. actual value is saved on the player's instance
    mode: PLAYER_MODE.NORMAL,
  };

  // Timeout for auto-hiding controls.
  autohideTimeoutId = null;

  componentWillMount() {
    const { isSliceable, history } = this.props;

    if (isSliceable) {
      const query = parse(history.location.search.slice(1));

      if (query.sstart || query.send) {
        this.setSliceMode(!!query.sliceEdit, {
          sliceStart: query.sstart ? parseFloat(query.sstart) : 0,
          sliceEnd: query.send ? parseFloat(query.send) : Infinity
        });
      }
    }
  }

  componentDidMount() {
    // By default hide controls after a while if player playing.
    this.hideControlsTimeout();
  }

  setSliceMode = (isEdit, properties, cb) => this.setState({
    mode: isEdit ? PLAYER_MODE.SLICE_EDIT : PLAYER_MODE.SLICE_VIEW,
    ...properties
  }, cb);

  setNormalMode = cb => this.setState({
    mode: PLAYER_MODE.NORMAL,
    sliceStart: undefined,
    sliceEnd: undefined
  }, cb);

  // Correctly fetch loaded buffers from video to show loading progress.
  // This code should be ported to react-media-player.
  buffers = () => {
    const videoElement = this.player_ && this.player_.instance;
    const ret              = [];
    if (videoElement) {
      for (let idx = 0; idx < videoElement.buffered.length; ++idx) {
        ret.push({
          start: videoElement.buffered.start(idx),
          end: videoElement.buffered.end(idx)
        });
      }
    }
    return ret;
  };

  // Remember the current time and isPlaying while switching.
  onSwitchAV = (...params) => {
    const { onSwitchAV, media: { currentTime, isPlaying } } = this.props;
    this.setState({ wasCurrentTime: currentTime, wasPlaying: isPlaying }, () => {
      onSwitchAV(...params);
    });
  }

  // Remember the current time and isPlaying while switching.
  onLanguageChange = (...params) => {
    const { onLanguageChange, media: { currentTime, isPlaying } } = this.props;
    this.setState({ wasCurrentTime: currentTime, wasPlaying: isPlaying }, () => {
      onLanguageChange(...params);
    });
  }

  onPlayerReady = () => {
    const { wasCurrentTime, wasPlaying } = this.state;
    const { media } = this.props;
    if (wasCurrentTime) {
      media.seekTo(wasCurrentTime);
    }
    if (wasPlaying) {
      media.play();
    }

    // restore playback from state when player instance changed (when src changes, e.g., playlist).
    this.player_.instance.playbackRate = playbackToValue(this.state.playbackRate);
    this.setState({ wasCurrentTime: undefined, wasPlaying: undefined });
  }

  handleTimeUpdate = (timeData) => {
    // This method is called all the time without stopping.
    const { isSliceable, media } = this.props;
    const { sliceEnd } = this.state;

    // stop playing when we're at the end of the slice or beyond
    if (isSliceable && timeData.currentTime >= sliceEnd) {
      media.pause();
      media.seekTo(sliceEnd);
    }
  }

  handleToggleMode = () => {
    const { mode } = this.state;

    if (mode === PLAYER_MODE.SLICE_EDIT || mode === PLAYER_MODE.SLICE_VIEW) {
      this.setNormalMode(this.resetSliceQuery);
    } else {
      this.setSliceMode(this.updateSliceQuery);
    }
  };

  handleSliceEndChange = (value) => {
    const newState = {
      sliceEnd: value
    };
    this.setState(newState);
    this.updateSliceQuery(newState);
  };

  handleSliceStartChange = (value) => {
    const newState = {
      sliceStart: value
    };
    this.setState(newState);
    this.updateSliceQuery(newState);
  };

  resetSliceQuery = () => {
    const { history } = this.props;
    const query = parse(history.location.search.slice(1));
    query.sstart = undefined;
    query.send = undefined;
    history.replace({ search: stringify(query) });
  };

  updateSliceQuery = (values) => {
    const { history, media } = this.props;
    const { sliceStart, sliceEnd } = this.state;

    const query = parse(history.location.search.slice(1));
    if (!values) {
      query.sstart = sliceStart || 0;
      query.send = (!sliceEnd || sliceEnd === Infinity) ? media.duration : sliceEnd;
    } else {
      if (typeof values.sliceEnd !== 'undefined') {
        query.send = +values.sliceEnd.toFixed(3);
      }

      if (typeof values.sliceStart !== 'undefined') {
        query.sstart = +values.sliceStart.toFixed(3);
      }
    }

    history.replace({ search: stringify(query) });
  }

  showControls = (callback) => {
    if (this.autohideTimeoutId) {
      clearTimeout(this.autohideTimeoutId);
      this.autohideTimeoutId = null;
    }
    this.setState({ controlsVisible: true }, callback);
  }

  hideControlsTimeout = () => {
    if (!this.autohideTimeoutId) {
      this.autohideTimeoutId = setTimeout(() => {
        this.setState({ controlsVisible: false });
      }, 2000);
    }
  }

  controlsEnter = () => {
    this.showControls();
  }

  centerMove = () => {
    this.showControls(() => this.hideControlsTimeout());
  }

  controlsLeave = () => {
    this.hideControlsTimeout();
  }

  playbackRateChange = (e, rate) => {
    this.player_.instance.playbackRate = playbackToValue(rate);
    this.setState({ playbackRate: rate });
  }

  onError = (e) => {
    // Show error only on loading of video.
    if (!e.currentTime && !e.isPlaying) {
      this.setState({ error: true });
    }
  }

  onPlay = (e) => {
    const { isSliceable, media } = this.props;
    const { sliceEnd } = this.state;

    // interrupt play if we're at the end of the slice
    if (isSliceable && e.currentTime >= sliceEnd) {
      media.pause();
      media.seekTo(sliceEnd);
      return;
    }

    if (this.props.onPlay) {
      this.props.onPlay();
    }
  }

  onPause = (e) => {
    // when we're close to the end regard this as finished
    if (Math.abs(e.currentTime - e.duration) < 0.1 && this.props.onFinish) {
      this.props.onFinish();
    } else if (this.props.onPause) {
      this.props.onPause();
    }
  }

  onKeyDown = (e) => {
    if (e.keyCode === 32) {
      this.props.media.playPause();
      e.preventDefault();
    }
  }

  render() {
    const { autoPlay, audio, video, active, languages, defaultLanguage, t, showNextPrev, hasNext, hasPrev, onPrev, onNext, isSliceable, media } = this.props;
    const { controlsVisible, error, sliceStart, sliceEnd, mode, playbackRate } = this.state;

    const { playPause, isFullscreen, isPlaying } = media;
    const forceShowControls = active === audio || !isPlaying;

    return (
      <div>
        <div
          className="media"
          style={{
            minHeight: active === video ? 200 : 40,
            minWidth: active === video ? 300 : 'auto'
          }}
        >
          <div
            className={classNames('media-player', {
              'media-player-fullscreen': isFullscreen,
              fade: !controlsVisible && !forceShowControls
            })}
          >
            <Player
              ref={c => this.player_ = c}
              src={physicalFile(active, true)}
              vendor={active === video ? 'video' : 'audio'}
              autoPlay={autoPlay}
              onReady={this.onPlayerReady}
              preload="auto"
              onError={this.onError}
              onPause={this.onPause}
              onPlay={this.onPlay}
              onTimeUpdate={this.handleTimeUpdate}
              defaultCurrentTime={sliceStart || 0}
            />
            <div
              className={classNames('media-controls', { fade: !controlsVisible && !forceShowControls })}
            >
              <div
                className="controls-wrapper"
                onMouseEnter={this.controlsEnter}
                onMouseLeave={this.controlsLeave}
              >
                <div className="controls-container">
                  <AVPlayPause
                    showNextPrev={showNextPrev}
                    hasNext={hasNext}
                    hasPrev={hasPrev}
                    onPrev={onPrev}
                    onNext={onNext}
                  />
                  <AVTimeElapsed
                    isSlice={isSliceable && (mode === PLAYER_MODE.SLICE_VIEW || mode === PLAYER_MODE.SLICE_EDIT)}
                    sliceStart={sliceStart}
                    sliceEnd={sliceEnd}
                  />
                  <AvSeekBar
                    buffers={this.buffers()}
                    playerMode={mode}
                    sliceStart={sliceStart}
                    sliceEnd={sliceEnd}
                    onSliceStartChange={this.handleSliceStartChange}
                    onSliceEndChange={this.handleSliceEndChange}
                  />
                  <AVPlaybackRate
                    value={playbackRate}
                    onSelect={this.playbackRateChange}
                    upward={video === active} />
                  <AVMuteUnmute upward={video === active} />
                  <AVAudioVideo
                    isAudio={audio === active}
                    isVideo={video === active}
                    setAudio={this.onSwitchAV}
                    setVideo={this.onSwitchAV}
                    t={t}
                  />
                  <AVLanguage
                    languages={languages}
                    defaultValue={defaultLanguage}
                    onSelect={this.onLanguageChange}
                    upward={video === active}
                  />
                  <AVFullScreen />
                  {
                    isSliceable && (
                      <AVSliceToggle
                        playerMode={mode}
                        onToggle={this.handleToggleMode}
                      />
                    )
                  }
                  {
                    isSliceable && (mode === PLAYER_MODE.SLICE_EDIT || mode === PLAYER_MODE.SLICE_VIEW) && (
                      <div className={classNames('player-control-slice-menu-wrapper', { 'downward': active === audio })}>
                        <AVSliceMenu
                          upward={active === video}
                          playerMode={mode}
                          onEdit={() => this.setSliceMode(true)}
                          onView={() => this.setSliceMode(false)}
                        />
                      </div>
                    )
                  }
                </div>
              </div>
              { active === video ? (
                  <div
                    className="media-center-control"
                    style={!error ? { outline: 'none' } : { backgroundColor: 'black', outline: 'none' }}
                    tabIndex="0"
                    onClick={() => playPause()}
                    onKeyDown={this.onKeyDown}
                    onMouseMove={this.centerMove}
                  >
                    {
                      error ? (
                        <div className="player-button">
                          Error loading file.
                          <Icon name="warning sign" size=" large" />
                        </div>
                      ) : <AVCenteredPlay />
                    }
                  </div>
                ) : null }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withMediaProps(withRouter(AVPlayerRMP));

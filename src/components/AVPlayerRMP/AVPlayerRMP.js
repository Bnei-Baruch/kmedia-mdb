import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { withRouter } from 'react-router-dom';
import { Player, withMediaProps } from 'react-media-player';
import classNames from 'classnames';
import { Icon } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { physicalFile } from '../../helpers/utils';
import { parse } from '../../helpers/url';
import AVPlayPause from './AVPlayPause';
import AVPlaybackRate from './AVPlaybackRate';
import AVCenteredPlay from './AVCenteredPlay';
import AVTimeElapsed from './AVTimeElapsed';
import AVFullScreen from './AVFullScreen';
import AVMuteUnmute from './AVMuteUnmute';
import AVLanguage from './AVLanguage';
import AVAudioVideo from './AVAudioVideo';
import AVProgress from './AVProgress';

// Converts playback rate string to float: 1.0x => 1.0
const playbackToValue = (playback) => {
  return parseFloat(playback.slice(0, -1))
};

class AVPlayerRMP extends PureComponent {

  static propTypes = {
    t: PropTypes.func.isRequired,

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
    location: PropTypes.object.isRequired, // TODO: (yaniv) set right propType

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

  static MODE = {
    NORMAL: 0,
    SLICE: 1
  };

  state = {
    controlsVisible: true,
    error: false,
    playbackRate: '1x', // this is used only to rerender the component. actual value is saved on the player's instance
    mode: AVPlayerRMP.MODE.NORMAL
  };

  // Timeout for auto-hiding controls.
  autohideTimeoutId = null;

  componentWillMount() {
    const { isSliceable, location } = this.props;

    if (isSliceable) {
      const query = parse(location.search.slice(1));

      if (query.sstart || query.send) {
        this.setSliceMode({
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

  setSliceMode = properties => this.setState({
    mode: AVPlayerRMP.MODE.SLICE,
    ...properties
  });

  setNormalMode = () => this.setState({
    mode: AVPlayerRMP.MODE.NORMAL,
    sliceStart: undefined,
    sliceEnd: undefined
  });

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

    // interupt play if we're at the end of the slice
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
                    onNext={onNext} />
                  <AVTimeElapsed
                    isSlice={isSliceable && !!(sliceStart || sliceEnd)}
                    sliceStart={sliceStart}
                    sliceEnd={sliceEnd}
                  />
                  <AVProgress
                    buffers={this.buffers()}
                    isSlice={mode === AVPlayerRMP.MODE.SLICE}
                    sliceStart={sliceStart}
                    sliceEnd={sliceEnd}
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
                </div>
              </div>
              { active === video ? (
                  <div className="media-center-control"
                       style={!error ? {outline: 'none'} : {backgroundColor: 'black', outline: 'none'}}
                       tabIndex="0"
                       onClick={() => playPause()}
                       onKeyDown={(e) => { playPause(); e.preventDefault(); }}
                       onMouseMove={this.centerMove}>
                    { error ? (
                        <div className="player-button">
                          Error loading file.
                          <Icon name={'warning sign'} size='large'/>
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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Media, Player } from 'react-media-player';
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

class AVPlayerRMP extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired, // TODO: (yaniv) set right propType
    audio: shapes.MDBFile,
    video: shapes.MDBFile,
    active: shapes.MDBFile,
    onSwitchAV: PropTypes.func.isRequired,
    // poster: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultValue: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    isSliceable: PropTypes.bool
  };

  static defaultProps = {
    audio: null,
    video: null,
    active: null,
    mediaType: null,
    poster: null,
    isSliceable: false
  };

  static MODE = {
    NORMAL: 0,
    SLICE: 1
  };

  constructor(props) {
    super(props);

    this.state = {
      videoElement: null,
      controlsVisible: true,
      timeoutId: null,
      error: false,
      playbackRate: '1x',
      mode: AVPlayerRMP.MODE.NORMAL
    };
  }

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
    const videoElement = this.player_.instance;
    this.setState({ videoElement });
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

  buffers = () => {
    const { videoElement } = this.state;
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
    const { onSwitchAV } = this.props;
    const { currentTime, isPlaying } = this.player_.context.media;
    this.setState({ wasCurrentTime: currentTime, wasPlaying: isPlaying }, () => {
      onSwitchAV(...params);
    });
  }

  // Remember the current time and isPlaying while switching.
  onLanguageChange = (...params) => {
    const { onLanguageChange } = this.props;
    const { currentTime, isPlaying } = this.player_.context.media;
    this.setState({ wasCurrentTime: currentTime, wasPlaying: isPlaying }, () => {
      onLanguageChange(...params);
    });
  }

  onPlayerReady = () => {
    const { wasCurrentTime, wasPlaying } = this.state;
    if (wasCurrentTime) {
      this.player_.context.media.seekTo(wasCurrentTime);
    }
    if (wasPlaying) {
      this.player_.context.media.play();
    }
    this.setState({wasCurrentTime: undefined, wasPlaying: undefined});
  }

  handleTimeUpdate = (timeData) => {
    const { isSliceable } = this.props;
    const { sliceEnd } = this.state;
    if (isSliceable && timeData.currentTime >= sliceEnd) {
      this.player_.context.media.pause();
    }
  }

  showControls = (callback = undefined) => {
    const { timeoutId } = this.state;
    if (timeoutId) {
      this.setState({controlsVisible: true, timeoutId: null}, () => {
        clearTimeout(timeoutId);
        if (callback) {
          callback();
        }
      });
    } else {
      this.setState({controlsVisible: true}, callback);
    }
  }

  hideControlsTimeout = () => {
    if (!this.state.timeoutId) {
      const timeoutId = setTimeout(() => {
        this.setState({controlsVisible: false});
      }, 2000);
      this.setState({timeoutId});
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
    this.state.videoElement.playbackRate = parseFloat(rate.slice(0, -1));
    this.setState({playbackRate: rate});
  }

  onError = (e) => {
    // Show error only on loading of video.
    if (!e.currentTime && !e.isPlaying) {
      this.setState({error: true});
    }
  }

  render() {
    const { audio, video, active, languages, defaultValue, t } = this.props;
    const { controlsVisible, error, playbackRate, videoElement, mode, sliceStart, sliceEnd } = this.state;

    const forceShowControls = !this.player_ || !this.player_.context.media.isPlaying;

    // TODO: playbackRate should be added to react media player repository.
    if (videoElement) {
      videoElement.playbackRate = parseFloat(this.state.playbackRate.slice(0, -1));
    }

    return (
      <div>

        <Media>
          {
            ({ playPause, isFullscreen }) => (
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
                    autoPlay={false}
                    onReady={this.onPlayerReady}
                    preload="auto"
                    onError={this.onError}
                    onTimeUpdate={this.handleTimeUpdate}
                    defaultCurrentTime={sliceStart || 0}
                  />
                  <div
                    className={classNames('media-controls', { fade: !controlsVisible && !forceShowControls })}
                  >
                    <div className="controls-wrapper"
                         onMouseEnter={this.controlsEnter}
                         onMouseLeave={this.controlsLeave}>
                      <div className="controls-container">
                        <AVPlayPause />
                        <AVTimeElapsed />
                        <AVProgress
                          buffers={this.buffers()}
                          isSlice={mode === AVPlayerRMP.MODE.SLICE}
                          sliceStart={sliceStart}
                          sliceEnd={sliceEnd}
                        />
                        <AVPlaybackRate
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
                          defaultValue={defaultValue}
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
            )
          }
        </Media>
      </div>
    );
  }
}

export default withRouter(AVPlayerRMP);

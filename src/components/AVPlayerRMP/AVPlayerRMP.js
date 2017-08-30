import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Media, Player } from 'react-media-player';
import classNames from 'classnames';
import { Icon } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { physicalFile } from '../../helpers/utils';
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
    autoPlay: PropTypes.bool,
    audio: shapes.MDBFile,
    video: shapes.MDBFile,
    active: shapes.MDBFile,
    onSwitchAV: PropTypes.func.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultLanguage: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    // Playlist props
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
    autoPlay: false,
    audio: null,
    video: null,
    active: null,
    mediaType: null,
    poster: null,
    showNextPrev: false,
    hasNext: false,
    hasPrev: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      videoElement: null,
      controlsVisible: true,
      timeoutId: null,
      error: false,
      playbackRate: '1x',
    };
  }

  componentDidMount() {
    const videoElement = this.player_.instance;
    this.setState({ videoElement });
    // By default hide controls after a while if player playing.
    this.hideControlsTimeout();
  }

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

  onPlay = (e) => {
    if (this.props.onPlay) {
      this.props.onPlay();
    }
  }

  onPause = (e) => {
    if (Math.abs(e.currentTime - e.duration) < 0.1 && this.props.onFinish) {
      this.props.onFinish();
    } else if (this.props.onPause) {
      this.props.onPause();
    }
  }

  render() {
    const { autoPlay, audio, video, active, languages, defaultLanguage, t, showNextPrev, hasNext, hasPrev, onPrev, onNext } = this.props;
    const { controlsVisible, error, playbackRate, videoElement } = this.state;

    const forceShowControls = !this.player_ || !this.player_.context.media.isPlaying;

    // TODO: playbackRate should be added to react media player repository.
    if (videoElement) {
      videoElement.playbackRate = parseFloat(this.state.playbackRate.slice(0, -1));
    }

    console.log('AVPlayerRMP', hasPrev, hasNext);

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
                    autoPlay={autoPlay}
                    onReady={this.onPlayerReady}
                    preload="auto"
                    onError={this.onError}
                    onPause={this.onPause}
                    onPlay={this.onPlay}
                  />
                  <div
                    className={classNames('media-controls', { fade: !controlsVisible && !forceShowControls })}
                  >
                    <div className="controls-wrapper"
                         onMouseEnter={this.controlsEnter}
                         onMouseLeave={this.controlsLeave}>
                      <div className="controls-container">
                        <AVPlayPause
                          showNextPrev={showNextPrev}
                          hasNext={hasNext}
                          hasPrev={hasPrev}
                          onPrev={onPrev}
                          onNext={onNext} />
                        <AVTimeElapsed />
                        <AVProgress buffers={this.buffers()} />
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
            )
          }
        </Media>
      </div>
    );
  }
}

export default AVPlayerRMP;

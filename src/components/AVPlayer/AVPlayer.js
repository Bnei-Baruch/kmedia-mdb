import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';
import { Player, utils, withMediaProps } from 'react-media-player';
import enableInlineVideo from 'iphone-inline-video';
import classNames from 'classnames';
import { Button, Icon } from 'semantic-ui-react';

import { MT_AUDIO, MT_VIDEO, VS_DEFAULT, VS_FHD, VS_HD, VS_NHD } from '../../helpers/consts';
import playerHelper from '../../helpers/player';
import { fromHumanReadableTime, toHumanReadableTime } from '../../helpers/time';
import { getQuery, updateQuery } from '../../helpers/url';
import { isEmpty } from '../../helpers/utils';
import { PLAYER_MODE } from './constants';
import AVPlayPause from './AVPlayPause';
import AVPlaybackRate from './AVPlaybackRate';
import AVVideoSize from './AVVideoSize';
import AVCenteredPlay from './AVCenteredPlay';
import AVTimeElapsed from './AVTimeElapsed';
import AVFullScreen from './AVFullScreen';
import AVMuteUnmute from './AVMuteUnmute';
import AVLanguage from './AVLanguage';
import AVAudioVideo from './AVAudioVideo';
import AvSeekBar from './AvSeekBar';
import AVEditSlice from './AVEditSlice';
import ShareBar from './ShareBar';
import AVJumpBack from './AVJumpBack';
import AVSpinner from './AVSpinner';

const PLAYER_VOLUME_STORAGE_KEY = '@@kmedia_player_volume';
const DEFAULT_PLAYER_VOLUME     = 0.8;

// Converts playback rate string to float: 1.0x => 1.0
const playbackToValue = playback =>
  parseFloat(playback.slice(0, -1));

class AVPlayer extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    media: PropTypes.object.isRequired,

    // Language dropdown props.
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    language: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,

    // Audio/Video switch props.
    item: PropTypes.object.isRequired, // TODO: (yaniv) add shape fo this
    onSwitchAV: PropTypes.func.isRequired,

    // Slice props
    history: shapes.History.isRequired,

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
    isTopSeekbar: false,
    controlsVisible: true,
    error: false,
    errorReason: '',
    playbackRate: '1x', // this is used only to rerender the component. actual value is saved on the player's instance
    videoSize: VS_DEFAULT,
    mode: PLAYER_MODE.NORMAL,
    persistenceFn: noop
  };

  componentWillMount() {
    const { history } = this.props;

    let sstart = 0;
    let send   = Infinity;

    let playerMode = PLAYER_MODE.NORMAL;
    const query    = getQuery(history.location);

    if (query.sstart) {
      playerMode = PLAYER_MODE.SLICE_VIEW;
      sstart     = fromHumanReadableTime(query.sstart).asSeconds();
    }
    if (query.send) {
      playerMode = PLAYER_MODE.SLICE_VIEW;
      send       = fromHumanReadableTime(query.send).asSeconds();
    }

    if (sstart > send) {
      playerMode = PLAYER_MODE.NORMAL;
    }

    this.setSliceMode(playerMode, {
      sliceStart: sstart,
      sliceEnd: send
    });

    this.setState({
      ...this.chooseSource(this.props)
    });
  }

  componentDidMount() {
    // By default hide controls after a while if player playing.
    this.hideControlsTimeout();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.props.item) {
      this.setState({
        error: false,
        errorReason: '',
        ...this.chooseSource(nextProps),
      });
    }
  }

  componentWillUnmount() {
    if (this.autohideTimeoutId) {
      clearTimeout(this.autohideTimeoutId);
      this.autohideTimeoutId = null;
    }
  }

  activatePersistence = () => {
    this.setState({ persistenceFn: this.persistVolume });
    let persistedVolume = localStorage.getItem(PLAYER_VOLUME_STORAGE_KEY);

    if (persistedVolume == null || Number.isNaN(persistedVolume)) {
      persistedVolume = DEFAULT_PLAYER_VOLUME;
      localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, persistedVolume);
    }
    this.props.media.setVolume(persistedVolume);
  };

  persistVolume = debounce(media => localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, media.volume), 200);

  chooseSource = (props) => {
    const { item, t } = props;
    if (isEmpty(item.byQuality)) {
      return { error: true, errorReason: t('messages.no-playable-files') };
    }

    let videoSize = playerHelper.restorePreferredVideoSize();
    let src       = item.byQuality[videoSize];

    // if we can't find the user preferred video size we fallback.
    // first we try to go down from where he was.
    // if we can't find anything on our way down we start go up.
    if (!src) {
      const vss = [VS_NHD, VS_HD, VS_FHD];
      const idx = vss.indexOf(videoSize);
      const o   = vss.slice(0, idx).reverse().concat(vss.slice(idx + 1));
      videoSize = o.find(x => !!item.byQuality[x]);
      src       = item.byQuality[videoSize];
    }

    return { src, videoSize };
  };

  // Remember the current time and isPlaying while switching.
  onSwitchAV = (...params) => {
    const { onSwitchAV, media: { currentTime, isPlaying } } = this.props;
    this.setState({ wasCurrentTime: currentTime, wasPlaying: isPlaying }, () => {
      onSwitchAV(...params);
    });
  };

  // Remember the current time and isPlaying while switching.
  onLanguageChange = (...params) => {
    const { onLanguageChange, media: { currentTime, isPlaying } } = this.props;
    this.setState({ wasCurrentTime: currentTime, wasPlaying: isPlaying }, () => {
      onLanguageChange(...params);
    });
  };

  onPlayerReady = () => {
    const { wasCurrentTime, wasPlaying } = this.state;
    const { media }                      = this.props;

    this.activatePersistence();

    if (wasCurrentTime) {
      media.seekTo(wasCurrentTime);
    }
    if (wasPlaying) {
      media.play();
    }

    // restore playback from state when player instance changed (when src changes, e.g., playlist).
    this.player.instance.playbackRate = playbackToValue(this.state.playbackRate);
    this.setState({ wasCurrentTime: undefined, wasPlaying: undefined });
  };

  playbackRateChange = (e, rate) => {
    this.player.instance.playbackRate = playbackToValue(rate);
    this.setState({ playbackRate: rate });
  };

  videoSizeChange = (e, vs) => {
    playerHelper.persistPreferredVideoSize(vs);

    if (vs !== this.state.videoSize) {
      const { media: { currentTime, isPlaying } } = this.props;
      this.setState({
        videoSize: vs,
        src: this.props.item.byQuality[vs],
        wasCurrentTime: currentTime,
        wasPlaying: isPlaying
      });
    }
  };

  onError = (e) => {
    const { t } = this.props;
    // Show error only on loading of video.
    if (!e.currentTime && !e.isPlaying) {
      const errorReason = t('messages.unknown');
      // const { item }  = this.props;
      // if (item.src.endsWith('wmv') || item.src.endsWith('flv')) {
      //   errorReason = t('messages.unsupported-media-format');
      // }
      this.setState({ error: true, errorReason });
    }
  };

  onPlay = () => {
    if (this.props.onPlay) {
      this.props.onPlay();
    }
  };

  onPause = (e) => {
    // when we're close to the end regard this as finished
    if (Math.abs(e.currentTime - e.duration) < 0.1 && this.props.onFinish) {
      this.props.onFinish();
    } else if (this.props.onPause) {
      this.props.onPause();
    }
  };

  onSeekBarResize = ({ width }) => {
    const MIN_SEEKBAR_SIZE = 100;
    if (this.state.isTopSeekbar !== (width < MIN_SEEKBAR_SIZE)) {
      this.setState({ isTopSeekbar: width < MIN_SEEKBAR_SIZE });
    }
  };

  setSliceMode = (playerMode, properties = {}, cb) => {
    const { media } = this.props;

    let { sliceStart, sliceEnd } = properties;
    if (typeof sliceStart === 'undefined') {
      sliceStart = this.state.sliceStart || 0;
    }
    if (typeof sliceEnd === 'undefined') {
      sliceEnd = this.state.sliceEnd || media.duration || Infinity;
    }

    this.setState({
      mode: playerMode,
      ...properties,
      sliceStart,
      sliceEnd
    }, cb);
  };

  setNormalMode = cb => this.setState({
    mode: PLAYER_MODE.NORMAL,
    sliceStart: undefined,
    sliceEnd: undefined
  }, cb);

  handleTimeUpdate = (timeData) => {
    const { media }          = this.props;
    const { mode, sliceEnd } = this.state;

    const isSliceMode = mode === PLAYER_MODE.SLICE_EDIT || mode === PLAYER_MODE.SLICE_VIEW;

    const lowerTime = Math.min(sliceEnd, timeData.currentTime);
    if (isSliceMode && lowerTime < sliceEnd && (sliceEnd - lowerTime < 0.5)) {
      media.pause();
      media.seekTo(sliceEnd);
    }
  };

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
    updateQuery(this.props.history, q => ({ ...q, sstart: undefined, send: undefined }));
  };

  // Correctly fetch loaded buffers from video to show loading progress.
  // This code should be ported to react-media-player.
  buffers = () => {
    const videoElement = this.player && this.player.instance;
    const ret          = [];
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

  updateSliceQuery = (values) => {
    const { history, media }       = this.props;
    const { sliceStart, sliceEnd } = this.state;

    updateQuery(history, (query) => {
      const q = { ...query };

      if (typeof values.sliceStart === 'undefined') {
        q.sstart = sliceStart || 0;
      } else {
        q.sstart = values.sliceStart;
      }

      if (typeof values.sliceEnd === 'undefined') {
        q.send = (!sliceEnd || sliceEnd === Infinity) ? media.duration : sliceEnd;
      } else {
        q.send = values.sliceEnd;
      }

      q.sstart = toHumanReadableTime(q.sstart);
      q.send   = toHumanReadableTime(q.send);
      return q;
    });
  };

  showControls = (hideLater = true) => {
    if (this.autohideTimeoutId) {
      clearTimeout(this.autohideTimeoutId);
      this.autohideTimeoutId = null;
    }

    if (hideLater) {
      this.setState({ controlsVisible: true }, this.hideControlsTimeout);
    } else {
      this.setState({ controlsVisible: true });
    }
  };

  hideControlsTimeout = () => {
    if (!this.autohideTimeoutId) {
      this.autohideTimeoutId = setTimeout(() => {
        this.setState({ controlsVisible: false });
      }, 2000);
    }
  };

  handleWrapperMouseEnter = () => {
    this.showControls();
  };

  handleWrapperMouseLeave = () => {
    this.setState({ controlsVisible: false });
  };

  handleWrapperMouseMove = () => {
    if (!this.state.controlsVisible) {
      this.showControls();
    }
  };

  handleControlsMouseEnter = () => {
    this.showControls(false);
  };

  handleControlsMouseLeave = () => {
    this.hideControlsTimeout();
  };

  handleWrapperKeyDown = (e) => {
    if (e.keyCode === 32) {
      if (!this.props.media.isLoading) {
        this.props.media.playPause();
      }
      e.preventDefault();
    }
  };

  handleWrapperRef = (ref) => {
    if (ref) {
      this.wrapper = ref;
      this.wrapper.addEventListener('keydown', this.handleWrapperKeyDown);
    } else if (this.wrapper) {
      this.wrapper.removeEventListener('keydown', this.handleWrapperKeyDown);
      this.wrapper = ref;
    }
  };

  handleOnScreenClick = () => {
    const { media } = this.props;

    if (!this.state.controlsVisible) {
      this.showControls();
    } else if (!media.isLoading) {
      // toggle play only if we in normal mode
      // because we don't want the slice mode on screen buttons
      // to toggle play/pause
      if (this.state.mode === PLAYER_MODE.NORMAL) {
        media.playPause();
      }
    }
  };

  handleOnScreenKeyDown = (e) => {
    if (e.keyCode === 32) {
      this.handleOnScreenClick();
      e.preventDefault();
    }
  };

  handleOnScreenRef = (ref) => {
    if (ref) {
      this.onScreen = ref;
      this.onScreen.addEventListener('click', this.handleOnScreenClick);
    } else if (this.onScreen) {
      this.onScreen.removeEventListener('click', this.handleOnScreenClick);
      this.onScreen = ref;
    }
  };

  render() {
    const {
            autoPlay,
            item,
            languages,
            language,
            t,
            showNextPrev,
            hasNext,
            hasPrev,
            onPrev,
            onNext,
            media,
          } = this.props;

    const {
            controlsVisible,
            sliceStart,
            sliceEnd,
            mode,
            playbackRate,
            videoSize,
            src,
            error,
            errorReason
          } = this.state;

    const { isPlaying }     = media;
    const forceShowControls = item.mediaType === MT_AUDIO || !isPlaying;
    const isVideo           = item.mediaType === MT_VIDEO;
    const isAudio           = item.mediaType === MT_AUDIO;
    const isEditMode        = mode === PLAYER_MODE.SLICE_EDIT;
    const fallbackMedia     = item.mediaType !== item.requestedMediaType;

    let centerMediaControl;
    if (error) {
      centerMediaControl = (
        <div className="player-button">
          {t('player.error.loading')}
          {errorReason ? ` ${errorReason}` : ''}
          &nbsp;
          <Icon name="warning sign" size="large" />
        </div>
      );
    } else if (isEditMode) {
      centerMediaControl = (
        <div>
          <Button
            content={t('player.buttons.edit-back')}
            size="large"
            color="blue"
            icon="chevron left"
            onClick={this.handleToggleMode}
          />
          <ShareBar url={window.location.href} t={t} />
        </div>
      );
    } else if (isVideo) {
      centerMediaControl = <div><AVCenteredPlay /><AVSpinner /></div>;
    }

    return (
      <div
        ref={(c) => {
          this.mediaElement = c;
        }}
        className={classNames('mediaplayer', { 'media-edit-mode': isEditMode })}
        onKeyDown={utils.keyboardControls.bind(null, media)}
        role="button"
        tabIndex="-1"
      >
        <Player
          playsInline
          ref={(c) => {
            this.player = c;
            if (c && c.instance) {
              enableInlineVideo(c.instance);
            }
          }}
          onVolumeChange={this.state.persistenceFn}
          src={src}
          poster={isVideo ? item.preImageUrl : null}
          vendor={isVideo ? 'video' : 'audio'}
          autoPlay={autoPlay}
          onReady={this.onPlayerReady}
          preload="auto"
          controls={false}
          onError={this.onError}
          onPause={this.onPause}
          onPlay={this.onPlay}
          onTimeUpdate={this.handleTimeUpdate}
          defaultCurrentTime={sliceStart || -1}  // -1 so RMP won't seek to 0 (browser won't fire seeked so we'll hang)
        />
        <div
          ref={this.handleWrapperRef}
          className="mediaplayer__wrapper"
          onMouseEnter={this.handleWrapperMouseEnter}
          onMouseLeave={this.handleWrapperMouseLeave}
          onMouseMove={this.handleWrapperMouseMove}
        >
          <div
            className={classNames('mediaplayer__controls', {
              'mediaplayer__controls--is-fade': !controlsVisible && !forceShowControls
            })}
            onMouseEnter={this.handleControlsMouseEnter}
            onMouseLeave={this.handleControlsMouseLeave}
          >
            <AVPlayPause
              showNextPrev={showNextPrev && !isEditMode}
              hasNext={hasNext}
              hasPrev={hasPrev}
              onPrev={onPrev}
              onNext={onNext}
            />
            <AVTimeElapsed
              start={media.currentTime}
              end={media.duration}
            />
            <div className="mediaplayer__spacer" />
            <AVJumpBack jumpSpan={-5} />
            <AVJumpBack jumpSpan={5} />
            <AvSeekBar
              buffers={this.buffers()}
              playerMode={mode}
              sliceStart={sliceStart}
              sliceEnd={sliceEnd}
              onSliceStartChange={this.handleSliceStartChange}
              onSliceEndChange={this.handleSliceEndChange}
            />

            {
              !isEditMode && (
                <AVPlaybackRate
                  value={playbackRate}
                  onSelect={this.playbackRateChange}
                />
              )
            }
            {
              !isEditMode && isVideo && (
                <AVVideoSize
                  value={videoSize}
                  qualities={Object.keys(item.byQuality)}
                  onSelect={this.videoSizeChange}
                />
              )
            }
            <AVMuteUnmute />
            {
              !isEditMode && (
                <AVAudioVideo
                  isAudio={isAudio}
                  isVideo={isVideo}
                  onSwitch={this.onSwitchAV}
                  fallbackMedia={fallbackMedia}
                  t={t}
                />
              )
            }
            {
              !isEditMode && (
                <AVLanguage
                  languages={languages}
                  language={language}
                  requestedLanguage={item.requestedLanguage}
                  onSelect={this.onLanguageChange}
                  t={t}
                />
              )
            }
            {!isEditMode && <AVEditSlice onActivateSlice={() => this.setSliceMode(PLAYER_MODE.SLICE_EDIT)} />}
            {!isEditMode && !isAudio && <AVFullScreen element={this.mediaElement} />}
          </div>
          <div
            ref={this.handleOnScreenRef}
            className="mediaplayer__onscreen-controls"
            role="button"
            tabIndex="0"
            onClick={this.handleOnScreenClick}
            onKeyPress={this.handleOnScreenKeyDown}
          >
            {centerMediaControl}
          </div>
        </div>

      </div>
    );
  }
}

export default withMediaProps(withRouter(AVPlayer));

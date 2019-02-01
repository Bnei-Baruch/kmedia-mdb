import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';
import { Player, utils, withMediaProps } from 'react-media-player';
import enableInlineVideo from 'iphone-inline-video';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { Icon } from 'semantic-ui-react';

import { MT_AUDIO, MT_VIDEO, VS_DEFAULT, VS_FHD, VS_HD, VS_NHD } from '../../helpers/consts';
import playerHelper from '../../helpers/player';
import { fromHumanReadableTime } from '../../helpers/time';
import { getQuery } from '../../helpers/url';
import { isEmpty } from '../../helpers/utils';
import * as shapes from '../shapes';
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
import AVJumpBack from './AVJumpBack';
import AVSpinner from './AVSpinner';
import ShareFormDesktop from './Share/ShareFormDesktop';

const DEFAULT_PLAYER_VOLUME       = 0.8;
const PLAYER_VOLUME_STORAGE_KEY   = '@@kmedia_player_volume';
const PLAYER_POSITION_STORAGE_KEY = '@@kmedia_player_position';

// Converts playback rate string to float: 1.0x => 1.0
const playbackToValue = playback => parseFloat(playback.slice(0, -1));

class AVPlayer extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    media: shapes.Media.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    requestedLanguage: PropTypes.string,

    // Language dropdown props.
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedLanguage: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,

    // Audio/Video switch props.
    item: shapes.VideoItem.isRequired,
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

    deviceInfo: shapes.UserAgentParserResults.isRequired,

    onMediaEditModeChange: PropTypes.func.isRequired,
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

  static chooseSource = (props) => {
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

  static persistVolume = debounce(media => localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, media.volume), 200);

  state = {
    controlsVisible: true,
    error: false,
    errorReason: '',
    playbackRate: '1x', // this is used only to rerender the component. actual value is saved on the player's instance
    videoSize: VS_DEFAULT,
    mode: PLAYER_MODE.NORMAL,
    persistenceFn: noop,
    isClient: false,
    currentTime: 0,
    firstSeek: true,
  };

  constructor(props) {
    super(props);
    const { history, media } = this.props;

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

    if (playerMode === PLAYER_MODE.SLICE_VIEW) {
      const newState = AVPlayer.getSliceModeState(media, playerMode, {
        sliceStart: sstart,
        sliceEnd: send
      }, this.state);
      this.state     = {
        ...this.state,
        ...newState,
      };
    }
  }

  componentDidMount() {
    // By default hide controls after a while if player playing.
    this.hideControlsTimeout();

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ isClient: true });

    const { deviceInfo: { browser: { name: browserName } }, media, item, autoPlay } = this.props;
    this.setState({
      browserName,
      firstSeek: true,
      item,
      ...AVPlayer.chooseSource(this.props)
    });

    // Bug fix for IE and Edge + Auto play for IE and Edge
    if (browserName === 'Edge' || browserName === 'IE') {
      media.play();
      if (!autoPlay) {
        setTimeout(media.pause, 0);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { item } = this.state;
    if (nextProps.item !== item) {
      this.setState({
        error: false,
        errorReason: '',
        firstSeek: true,
        item: nextProps.item,
        ...AVPlayer.chooseSource(nextProps),
      });
    }
  }

  componentWillUnmount() {
    if (this.autohideTimeoutId) {
      clearTimeout(this.autohideTimeoutId);
      this.autohideTimeoutId = null;
    }
  }

  // Remember the current time while switching.
  onSwitchAV = (...params) => {
    const { onSwitchAV, media: { currentTime } } = this.props;
    this.setState({ wasCurrentTime: currentTime }, () => {
      onSwitchAV(...params);
    });
  };

  // Remember the current time while switching.
  onLanguageChange = (...params) => {
    const { onLanguageChange, media: { currentTime } } = this.props;
    this.setState({ wasCurrentTime: currentTime }, () => {
      onLanguageChange(...params);
    });
  };

  onPlayerReady = () => {
    const { wasCurrentTime, sliceStart, firstSeek, playbackRate } = this.state;
    const { media, autoPlay }                                     = this.props;

    this.activatePersistence();

    if (wasCurrentTime && !firstSeek) {
      media.seekTo(wasCurrentTime);
    } else if (!sliceStart && firstSeek) {
      const savedTime = this.getSavedTime();
      if (savedTime) {
        media.seekTo(savedTime);
      }
    }
    if (autoPlay && firstSeek) {
      media.play();
    }
    // restore playback from state when player instance changed (when src changes, e.g., playlist).
    this.player.instance.playbackRate = playbackToValue(playbackRate);
    this.setState({ wasCurrentTime: undefined, firstSeek: false });
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
    const { onPlay } = this.props;
    if (onPlay) {
      onPlay();
    }
  };

  onPause = (e) => {
    const { browserName }       = this.state;
    const { onPause, onFinish } = this.props;
    // when we're close to the end regard this as finished
    if (browserName !== 'IE'
      && Math.abs(e.currentTime - e.duration) < 0.1 && onFinish) {
      this.clearCurrentTime();
      onFinish();
    } else if (onPause) {
      onPause();
    }
  };

  static getSliceModeState(media, mode, properties = {}, state) {
    let { sliceStart, sliceEnd } = properties;
    if (typeof sliceStart === 'undefined') {
      sliceStart = state.sliceStart || 0;
    }
    if (typeof sliceEnd === 'undefined') {
      sliceEnd = state.sliceEnd || media.duration || Infinity;
    }

    return {
      mode,
      sliceStart,
      sliceEnd
    };
  }

  videoSizeChange = (e, vs) => {
    const { videoSize } = this.state;
    playerHelper.persistPreferredVideoSize(vs);

    if (vs !== videoSize) {
      const { media: { currentTime }, item: { byQuality } } = this.props;
      this.setState({
        videoSize: vs,
        src: byQuality[vs],
        wasCurrentTime: currentTime
      });
    }
  };

  playbackRateChange = (e, rate) => {
    this.player.instance.playbackRate = playbackToValue(rate);
    this.setState({ playbackRate: rate });
  };

  activatePersistence = () => {
    const { media } = this.props;
    this.setState({ persistenceFn: AVPlayer.persistVolume });
    let persistedVolume = localStorage.getItem(PLAYER_VOLUME_STORAGE_KEY);

    if (persistedVolume == null || Number.isNaN(Number.parseInt(persistedVolume, 10))) {
      persistedVolume = DEFAULT_PLAYER_VOLUME.toString();
      localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, persistedVolume);
    }
    media.setVolume(persistedVolume);
  };

  setSliceMode = (mode, properties = {}) => {
    const { media, onMediaEditModeChange } = this.props;
    const state                            = AVPlayer.getSliceModeState(media, mode, properties, this.state);
    this.setState(state);

    onMediaEditModeChange(mode);
  };

  handleTimeUpdate = (timeData) => {
    const { media, onFinish }                                    = this.props;
    const { mode, sliceEnd, sliceStart, firstSeek, browserName } = this.state;

    const isSliceMode = mode === PLAYER_MODE.SLICE_VIEW;

    const lowerTime = Math.min(sliceEnd, timeData.currentTime);
    if (isSliceMode && (timeData.currentTime < sliceStart || timeData.currentTime > sliceEnd)) {
      this.setState({
        mode: PLAYER_MODE.NORMAL,
        sliceStart: undefined,
        sliceEnd: undefined,
      });
    } else if (isSliceMode && lowerTime < sliceEnd && (sliceEnd - lowerTime < 0.5)) {
      media.pause();
      media.seekTo(sliceEnd);
    }

    // when we're close to the end regard this as finished
    if (browserName === 'IE'
      && !firstSeek && Math.abs(timeData.currentTime - timeData.duration) < 0.5 && onFinish) {
      media.pause();
      this.clearCurrentTime();
      onFinish();
    } else {
      this.saveCurrentTime();
    }
  };

  handleEditBack = () => {
    this.setState({
      mode: PLAYER_MODE.NORMAL,
      sliceStart: undefined,
      sliceEnd: undefined
    });
  };

  handleSliceChange = (sliceStart, sliceEnd) => {
    this.setState({ sliceStart, sliceEnd });
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

  hideControls = () => {
    if (this.wrapperMouseY < this.wrapperRect.height - this.controlsRect.height) {
      this.setState({ controlsVisible: false });
    } else {
      if (this.autohideTimeoutId) {
        clearTimeout(this.autohideTimeoutId);
        this.autohideTimeoutId = null;
      }
      this.hideControlsTimeout();
    }
  };

  hideControlsTimeout = () => {
    if (!this.autohideTimeoutId) {
      this.autohideTimeoutId = setTimeout(this.hideControls, 2000);
    }
  };

  handleWrapperMouseEnter = () => this.showControls();

  handleWrapperMouseLeave = () => this.hideControls();

  handleWrapperMouseMove = (e) => {
    const { controlsVisible } = this.state;
    if (!controlsVisible) {
      this.showControls();
    }
    this.wrapperMouseY = e.pageY - this.wrapperRect.top;
  };

  handleControlsMouseEnter = () => {
    this.showControls(false);
  };

  handleControlsMouseLeave = () => {
    this.hideControlsTimeout();
  };

  handleWrapperKeyDown = (e) => {
    const { media: { isLoading, playPause } } = this.props;

    if (e.keyCode === 32) {
      if (!isLoading) {
        playPause();
      }
      e.preventDefault();
    }
  };

  handleWrapperRef = (ref) => {
    if (ref) {
      this.wrapper = ref;
      this.wrapper.addEventListener('keydown', this.handleWrapperKeyDown);
      this.wrapperRect = this.wrapper.getBoundingClientRect();
    } else if (this.wrapper) {
      this.wrapper.removeEventListener('keydown', this.handleWrapperKeyDown);
      this.wrapper = ref;
    }
  };

  handlePlayerControlsRef = (ref) => {
    this.playerControls = ref;
    if (this.playerControls) {
      this.controlsRect = ref.getBoundingClientRect();
    }
  };

  handleOnScreenClick = () => {
    const { media: { isLoading, playPause } } = this.props;
    const { controlsVisible, mode }           = this.state;

    if (!controlsVisible) {
      this.showControls();
    } else if (!isLoading) {
      // toggle play only if we in normal mode
      // because we don't want the slice mode on screen buttons
      // to toggle play/pause
      if (mode === PLAYER_MODE.NORMAL) {
        playPause();
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

  saveCurrentTime = () => {
    const { currentTime, firstSeek } = this.state;
    const { media, item }            = this.props;
    if (media && item && item.unit && item.unit.id && !firstSeek) {
      const currentMediaTime = Math.round(media.currentTime);
      if (currentMediaTime !== currentTime) {
        this.setState({ currentTime: currentMediaTime });
        localStorage.setItem(`${PLAYER_POSITION_STORAGE_KEY}_${item.unit.id}`, currentMediaTime.toString());
      }
    }
  };

  clearCurrentTime = () => {
    const { item } = this.props;
    if (item && item.unit && item.unit.id) {
      localStorage.removeItem(`${PLAYER_POSITION_STORAGE_KEY}_${item.unit.id}`);
    }
  };

  getSavedTime = () => {
    const { item } = this.props;
    // Try to get the current time from local storage if available
    if (item && item.unit && item.unit.id) {
      const savedTime = localStorage.getItem(`${PLAYER_POSITION_STORAGE_KEY}_${item.unit.id}`);
      if (savedTime) {
        return parseInt(savedTime, 10);
      }
    }
    return null;
  };

  render() {
    const
      {
        item,
        languages,
        selectedLanguage,
        uiLanguage,
        requestedLanguage,
        t,
        showNextPrev,
        hasNext,
        hasPrev,
        onPrev,
        onNext,
        media,
      } = this.props;

    const
      {
        controlsVisible,
        sliceStart,
        sliceEnd,
        mode,
        playbackRate,
        videoSize,
        src,
        error,
        errorReason,
        isClient,
        persistenceFn,
      } = this.state;

    const { isPlaying }      = media;
    const [isVideo, isAudio] = [item.mediaType === MT_VIDEO, item.mediaType === MT_AUDIO];
    const isEditMode         = mode === PLAYER_MODE.SLICE_EDIT;
    const forceShowControls  = item.mediaType === MT_AUDIO || !isPlaying || isEditMode;
    const fallbackMedia      = item.mediaType !== item.requestedMediaType;

    let centerMediaControl;
    if (error) {
      centerMediaControl = (
        <div className="player-button player-error-message">
          {t('player.error.loading')}
          {errorReason ? ` ${errorReason}` : ''}
          &nbsp;
          <Icon name="warning sign" size="large" />
        </div>
      );
    } else if (isEditMode) {
      centerMediaControl = (
        <ShareFormDesktop
          media={media}
          item={item}
          onSliceChange={this.handleSliceChange}
          onExit={this.handleEditBack}
        />
      );
    } else if (isVideo) {
      centerMediaControl = (
        <Fragment>
          <AVCenteredPlay />
          <AVSpinner />
        </Fragment>
      );
    }

    const handleKeyDown = utils.keyboardControls.bind(null, media);

    return (
      <div
        ref={(c) => {
          this.mediaElement = c;
        }}
        className={classNames('mediaplayer', { 'media-edit-mode': isEditMode })}
        onKeyDown={handleKeyDown}
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
          onVolumeChange={persistenceFn}
          src={src}
          poster={isVideo ? item.preImageUrl : null}
          vendor={isVideo ? 'video' : 'audio'}
          onReady={this.onPlayerReady}
          preload={isClient ? 'auto' : 'none'}
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
            ref={this.handlePlayerControlsRef}
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
            <AVJumpBack jumpSpan={-5} />
            <AVJumpBack jumpSpan={5} />
            <div className="mediaplayer__spacer" />
            <AvSeekBar
              buffers={this.buffers()}
              playerMode={mode}
              sliceStart={sliceStart}
              sliceEnd={sliceEnd}
            />

            <AVPlaybackRate
              value={playbackRate}
              onSelect={this.playbackRateChange}
            />

            {
              isVideo && (
                <AVVideoSize
                  value={videoSize}
                  qualities={Object.keys(item.byQuality)}
                  onSelect={this.videoSizeChange}
                />
              )
            }
            <AVMuteUnmute isAudio={isAudio} />
            <AVAudioVideo
              isAudio={isAudio}
              isVideo={isVideo}
              onSwitch={this.onSwitchAV}
              fallbackMedia={fallbackMedia}
              uiLanguage={uiLanguage}
            />
            <AVLanguage
              languages={languages}
              selectedLanguage={selectedLanguage}
              uiLanguage={uiLanguage}
              requestedLanguage={requestedLanguage}
              onSelect={this.onLanguageChange}
            />
            {!isEditMode && <AVEditSlice onActivateSlice={() => this.setSliceMode(PLAYER_MODE.SLICE_EDIT)} />}
            {isEditMode && <AVEditSlice onActivateSlice={() => this.setSliceMode(PLAYER_MODE.NORMAL)} />}
            {!isAudio && <AVFullScreen element={this.mediaElement} />}
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

export default withNamespaces()(withMediaProps(withRouter(AVPlayer)));

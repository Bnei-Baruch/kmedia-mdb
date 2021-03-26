import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { noop } from '../../helpers/utils';
import debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';
import { Player, utils, withMediaProps } from 'react-media-player';
import enableInlineVideo from 'iphone-inline-video';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { Button, Icon } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

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
import { isLanguageRtl } from '../../helpers/i18n-utils';
import { PlayerStartEnum } from './playerStartEnum';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from '../../redux/modules/player';

const DEFAULT_PLAYER_VOLUME       = 0.8;
const PLAYER_VOLUME_STORAGE_KEY   = '@@kmedia_player_volume';
const PLAYER_POSITION_STORAGE_KEY = '@@kmedia_player_position';

// Converts playback rate string to float: 1.0x => 1.0
const playbackToValue = playback => parseFloat(playback.slice(0, -1));

class AVPlayer extends Component {
  static contextType = DeviceInfoContext;

  static propTypes = {
    t: PropTypes.func.isRequired,
    media: shapes.Media.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    requestedLanguage: PropTypes.string,
    chronicles: PropTypes.shape(),

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

    onMediaEditModeChange: PropTypes.func.isRequired,
    onDropdownOpenedChange: PropTypes.func.isRequired,

    // Player actions.
    actionPlayerPlay: PropTypes.func.isRequired,
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
    requestedLanguage: 'en',
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

  static persistVolume = debounce(volume => localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, volume), 200);

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

  // the player has to re-render during play because of the media changes,
  // so no need to shouldComponentUpdate here

  componentDidMount() {
    const { history } = this.props;
    const query       = getQuery(history.location);
    const start       = PlayerStartEnum.GetFromQuery(query);
    // By default hide controls after a while if player playing.
    this.hideControlsTimeout();

    const { media, item, autoPlay }                          = this.props;
    const { deviceInfo: { browser: { name: browserName } } } = this.context;
    this.setState({
      isClient: true,
      start,
      browserName,
      firstSeek: true,
      item,
      ...AVPlayer.chooseSource(this.props)
    });

    // Bug fix for IE and Edge + Auto play for IE and Edge
    if (browserName === 'Edge' || browserName === 'IE') {
      media.play();
      if (!autoPlay || start === PlayerStartEnum.Stop) {
        setTimeout(media.pause, 0);
      }
    }
    this.receiveMessageFunc = this.receiveMessage.bind(this);
    window.addEventListener('message', this.receiveMessageFunc, false);
  }

  componentDidUpdate() {
    const { item, chronicles } = this.props;
    if (!isEqual(this.state.item, item)) {
      if (this.isUnitExistAndPlaying() && this.state?.item?.unit?.id !== item?.unit?.id) {
        chronicles.append('player-stop', this.buildAppendData());
      }
      this.setState({
        error: false,
        errorReason: '',
        firstSeek: true,
        item: item,
        ...AVPlayer.chooseSource(this.props),
      });
    }
  }

  componentWillUnmount() {
    const { chronicles } = this.props;
    if (this.autohideTimeoutId) {
      clearTimeout(this.autohideTimeoutId);
      this.autohideTimeoutId = null;
    }
    window.removeEventListener('message', this.receiveMessageFunc, false);
    if (this.isUnitExistAndPlaying()) {
      chronicles.append('player-stop', this.buildAppendData());
    }
  }

  isUnitExistAndPlaying() {
    return this.props.media?.isPlaying && this.state.item?.unit?.id;
  }

  receiveMessage(event) {
    const { media, item } = this.props;
    try {
      switch (event.data.command) {
      case 'play':
        media.play();
        break;
      case 'stop':
        media.stop();
        break;
      case 'pause':
        media.pause();
        break;
      case 'exitFullscreen':
        media.exitFullscreen();
        break;
      case 'mute':
        media.mute(true);
        break;
      case 'muteUnmute':
        media.muteUnmute();
        break;
      case 'setVolume':
        if (event.data.volume === undefined) {
          event.data.volume = 50;
        }
        media.setVolume(event.data.volume);
        break;
      case 'getVolume':
        this.sendCallbackMessage(event.data, { status: 'ok', result: media.volume });
        return;
      case 'getCurrentTime':
        this.sendCallbackMessage(event.data, { status: 'ok', result: media.currentTime });
        return;
      case 'setCurrentTime':
        if (event.data.currentTime === undefined) {
          event.data.currentTime = 0;
        }
        media.seekTo(event.data.currentTime);
        break;
      case 'getInfo':
        this.sendCallbackMessage(event.data, { status: 'ok', result: item });
        return;
      case 'isFullScreen':
        this.sendCallbackMessage(event.data, { status: 'ok', result: media.isFullScreen });
        return;
      case 'isLoading':
        this.sendCallbackMessage(event.data, { status: 'ok', result: media.isLoading });
        return;
      case 'isMuted':
        this.sendCallbackMessage(event.data, { status: 'ok', result: media.isMuted });
        return;
      case 'isPlaying':
        this.sendCallbackMessage(event.data, { status: 'ok', result: media.isPlaying });
        return;
      default:
        // Ignore commands that weren't sent to us
        return;
      }
      this.sendCallbackMessage(event.data, { status: 'ok' });
    } catch (e) {
      console.error('Error while receive external message in AVPlayer: ' + e);
    }
  }

  sendCallbackMessage = (params, result) => window.parent?.postMessage({ params, result }, '*');

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
    const { wasCurrentTime, sliceStart, firstSeek, playbackRate, start } = this.state;
    const { media, autoPlay }                                            = this.props;

    if (start === PlayerStartEnum.UseParentLogic) {
      this.activatePersistence();
    }

    if (wasCurrentTime && !firstSeek) {
      media.seekTo(wasCurrentTime);
    } else if (!sliceStart && start === PlayerStartEnum.UseParentLogic && firstSeek) {
      const savedTime = this.getSavedTime();
      if (savedTime) {
        media.seekTo(savedTime);
      }
    }
    // Start the player if auto play needed
    if (firstSeek && ((autoPlay && start !== PlayerStartEnum.Stop) || start === PlayerStartEnum.Start)) {
      // Mute the video if auto play video
      if (start === PlayerStartEnum.Start && this.props.item.mediaType === MT_VIDEO) {
        media.mute(true);
        this.setState({ unMuteButton: true });
      }
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

  buildAppendData = () => {
    const { autoPlay, item, media } = this.props;
    const { src } = this.state;
    return {
      unit_uid: item?.unit?.id,
      file_src: src,
      current_time: media.currentTime,
      duration: media.duration,
      auto_play: autoPlay,
      // media.isMuted is actually the state before the action, so we call it was_muted.
      // This is specifically relevant for the mute-unmute action.
      was_muted: media.isMuted,
    };
  };

  onPlay = () => {
    const { chronicles, onPlay, item, actionPlayerPlay } = this.props;
    if (onPlay) {
      onPlay();
    }
    const unitId = item?.unit?.id;
    if (unitId) {
      chronicles.append('player-play', this.buildAppendData());
      actionPlayerPlay(unitId);
    }
  };

  onPause = (e) => {
    const { browserName } = this.state;
    const { onPause, onFinish, item, chronicles } = this.props;
    // when we're close to the end regard this as finished
    if (browserName !== 'IE'
      && Math.abs(e.currentTime - e.duration) < 0.1 && onFinish) {
      this.clearCurrentTime();
      onFinish();
    } else if (onPause) {
      onPause();
    }
    if (item?.unit?.id) {
      chronicles.append('player-stop', this.buildAppendData());
    }
  };

  handleUnMute = () => {
    const { media } = this.props;
    media.mute(false);
    this.removeUnMuteButton();
  };

  removeUnMuteButton = () => {
    this.setState({ unMuteButton: false });
  };

  onVolumeChange = (volume) => {
    const { persistenceFn } = this.state;
    persistenceFn && persistenceFn(volume);
    this.removeUnMuteButton();
  };

  onMuteUnmute = () => {
    const { chronicles } = this.props;
    this.removeUnMuteButton();
    if (this.isUnitExistAndPlaying()) {
      chronicles.append('mute-unmute', this.buildAppendData());
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
    if (!this.mouseEnter || this.wrapperMouseY < this.wrapperRect.height - this.controlsRect.height) {
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

  handleWrapperMouseEnter = () => {
    this.mouseEnter = true;
    this.showControls();
  };

  handleWrapperMouseLeave = () => {
    this.mouseEnter = false;
    this.hideControls();
  };

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

  getMedia = () => this.props.media;

  renderUnmuteButton(isRtl, t) {
    return <Button
      icon="volume off"
      className={isRtl ? 'mediaplayer__embedUnmuteButton rtl' : 'mediaplayer__embedUnmuteButton'}
      content={t('player.buttons.tap-to-unmute')}
      onClick={this.handleUnMute}
    />;
  }

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
        onDropdownOpenedChange
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
        unMuteButton,
      } = this.state;

    const { isPlaying }      = media;
    const [isVideo, isAudio] = [item.mediaType === MT_VIDEO, item.mediaType === MT_AUDIO];
    const isEditMode         = mode === PLAYER_MODE.SLICE_EDIT;
    const forceShowControls  = item.mediaType === MT_AUDIO || !isPlaying || isEditMode;
    const fallbackMedia      = item.mediaType !== item.requestedMediaType;
    const isRtl              = isLanguageRtl(uiLanguage);

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
          uiLanguage={uiLanguage}
          onSliceChange={this.handleSliceChange}
          onExit={this.handleEditBack}
        />
      );
    } else if (isVideo) {
      centerMediaControl = (
        <Fragment>
          <AVCenteredPlay media={media} />
          <AVSpinner isLoading={media.isLoading} />
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
        {
          isVideo && unMuteButton && this.renderUnmuteButton(isRtl, t)
        }
        <Player
          playsInline
          ref={(c) => {
            this.player = c;
            if (c && c.instance) {
              enableInlineVideo(c.instance);
            }
          }}
          src={src}
          poster={isVideo ? item.preImageUrl : null}
          vendor={isVideo ? 'video' : 'audio'}
          onReady={this.onPlayerReady}
          preload={isClient ? 'metadata' : 'none'}
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
              media={media}
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
            {/* media current time is changed while playing */}
            <AVJumpBack jumpSpan={-5} getMedia={this.getMedia} />
            <AVJumpBack jumpSpan={5} getMedia={this.getMedia} />
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
              onDropdownOpenedChange={onDropdownOpenedChange}
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
            <AVMuteUnmute
              media={media}
              isAudio={isAudio}
              onMuteUnmute={this.onMuteUnmute}
              onVolumeChange={this.onVolumeChange}
            />
            <AVAudioVideo
              isAudio={isAudio}
              isVideo={isVideo}
              onSwitch={this.onSwitchAV}
              fallbackMedia={fallbackMedia}
              uiLanguage={uiLanguage}
              t={t}
            />
            <AVLanguage
              languages={languages}
              selectedLanguage={selectedLanguage}
              uiLanguage={uiLanguage}
              requestedLanguage={requestedLanguage}
              onSelect={this.onLanguageChange}
              onDropdownOpenedChange={onDropdownOpenedChange}
              t={t}
              cuId={item.unit?.id}
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

const mapDispatch = dispatch => (
  bindActionCreators({
    actionPlayerPlay: actions.playerPlay,
  }, dispatch)
);

export default withNamespaces()(withMediaProps(withRouter(connect(() => ({}), mapDispatch)(AVPlayer))));

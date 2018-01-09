import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';
import { Player, withMediaProps, utils } from 'react-media-player';
import classNames from 'classnames';
import { Button, Icon } from 'semantic-ui-react';

import withIsMobile from '../../helpers/withIsMobile';
import { parse, stringify } from '../../helpers/url';
import { MT_AUDIO, MT_VIDEO } from '../../helpers/consts';
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
import AVEditSlice from './AVEditSlice';
import AVShareBar from './AVShareBar';
import AVJumpBack from './AVJumpBack';
import AVSpinner from './AVSpinner';

const PLAYER_VOLUME_STORAGE_KEY = '@@kmedia_player_volume';
const DEFAULT_PLAYER_VOLUME     = 0.8;

// Converts playback rate string to float: 1.0x => 1.0
const playbackToValue = playback =>
  parseFloat(playback.slice(0, -1));

class AVPlayerRMP extends PureComponent {

  static propTypes = {
    t: PropTypes.func.isRequired,
    media: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,

    // Language dropdown props.
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    language: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,

    // Audio/Video switch props.
    item: PropTypes.object.isRequired, // TODO: (yaniv) add shape fo this
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
    isTopSeekbar: false,
    controlsVisible: true,
    error: false,
    errorReason: '',
    playbackRate: '1x', // this is used only to rerender the component. actual value is saved on the player's instance
    mode: PLAYER_MODE.NORMAL,
    persistenceFn: noop
  };

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.props.item) {
      this.setState({ error: false, errorReason: '' });
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

    if (persistedVolume == null || isNaN(persistedVolume)) {
      persistedVolume = DEFAULT_PLAYER_VOLUME;
      localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, persistedVolume);
    }
    this.props.media.setVolume(persistedVolume);
  };

  persistVolume = debounce(media => localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, media.volume), 200);

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

  onError = (e) => {
    const { t } = this.props;
    // Show error only on loading of video.
    if (!e.currentTime && !e.isPlaying) {
      const { item }  = this.props;
      let errorReason = '';
      if (item.src.endsWith('wmv') || item.src.endsWith('flv')) {
        errorReason = t('messages.unsupported-media-format');
      } else {
        errorReason = t('messages.unknown');
      }
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

  onKeyDown = (e) => {
    if (e.keyCode === 32) {
      if (!this.props.media.isLoading)
        this.props.media.playPause();
      e.preventDefault();
    }
  };

  onSeekBarResize = ({ width }) => {
    const MIN_SEEKBAR_SIZE = 100;
    if (this.state.isTopSeekbar !== (width < MIN_SEEKBAR_SIZE)) {
      this.setState({ isTopSeekbar: width < MIN_SEEKBAR_SIZE });
    }
  };

  setSliceMode = (isEdit, properties = {}, cb) => {
    let sliceStart  = properties.sliceStart;
    let sliceEnd    = properties.sliceEnd;
    const { media } = this.props;

    if (isEdit) {
      media.pause();
    }

    if (typeof sliceStart === 'undefined') {
      sliceStart = this.state.sliceStart || 0;
    }

    if (typeof sliceEnd === 'undefined') {
      sliceEnd = this.state.sliceEnd || media.duration || Infinity;
    }
    this.setState({
      mode: isEdit ? PLAYER_MODE.SLICE_EDIT : PLAYER_MODE.SLICE_VIEW,
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
    const { history } = this.props;
    const query       = parse(history.location.search.slice(1));
    query.sstart      = undefined;
    query.send        = undefined;
    history.replace({ search: stringify(query) });
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

    const query = parse(history.location.search.slice(1));
    if (!values) {
      query.sstart = sliceStart || 0;
      query.send   = (!sliceEnd || sliceEnd === Infinity) ? media.duration : sliceEnd;
    } else {
      if (typeof values.sliceEnd !== 'undefined') {
        query.send = +values.sliceEnd.toFixed(3);
      }

      if (typeof values.sliceStart !== 'undefined') {
        query.sstart = +values.sliceStart.toFixed(3);
      }
    }

    history.replace({ search: stringify(query) });
  };

  showControls = (callback) => {
    if (this.autohideTimeoutId) {
      clearTimeout(this.autohideTimeoutId);
      this.autohideTimeoutId = null;
    }
    this.setState({ controlsVisible: true }, callback);
  };

  hideControlsTimeout = () => {
    if (!this.autohideTimeoutId) {
      this.autohideTimeoutId = setTimeout(() => {
        this.setState({ controlsVisible: false });
      }, 2000);
    }
  };

  controlsEnter = () => {
    this.showControls();
  };

  centerMove = () => {
    const { isMobile } = this.props;
    if (!isMobile) {
      this.showControls(() => this.hideControlsTimeout());
    }
  };

  controlsLeave = () => {
    this.hideControlsTimeout();
  };

  playbackRateChange = (e, rate) => {
    this.player.instance.playbackRate = playbackToValue(rate);
    this.setState({ playbackRate: rate });
  };

  playPause = () => {
    const { isMobile, media } = this.props;

    if (isMobile && !this.state.controlsVisible) {
      this.showControls(() => this.hideControlsTimeout());
    } else {
      if (!media.isLoading)
        media.playPause();
    }
  };

  render() {
    const {
            isMobile,
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
            isSliceable
          } = this.props;
    const {
            controlsVisible,
            sliceStart,
            sliceEnd,
            mode,
            playbackRate,
          } = this.state;
    let {
            error,
            errorReason,
          } = this.state;

    const { isPlaying } = media;
    const forceShowControls           = item.mediaType === MT_AUDIO || !isPlaying;

    const isVideo       = item.mediaType === MT_VIDEO;
    const isAudio       = item.mediaType === MT_AUDIO;
    const isEditMode    = mode === PLAYER_MODE.SLICE_EDIT;
    const fallbackMedia = item.mediaType !== item.requestedMediaType;

    if (!item.src) {
      error       = true;
      errorReason = t('messages.no-playable-files');
    }

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
        <div className="center-media-controls-edit">
          <Button
            icon="chevron left"
            content={t('player.buttons.edit-back')}
            size="large"
            color="blue"
            className="button-close-slice-edit"
            onClick={this.handleToggleMode}
          />
          <div className="slice-edit-help">
            {t('player.messages.edit-help')}
          </div>
          <AVShareBar />
        </div>
      );
    } else if (isVideo) {
      centerMediaControl = <div><AVCenteredPlay /><AVSpinner /></div>;
    }

    return (
      <div>
      {/*
        <div style={{ position: 'fixed', background:'yellow', top:'0', left:'0', zIndex:'999999999', padding:'20px' }}>
          {this.player ? this.player._component._player.videoHeight + 'x' + this.player._component._player.videoWidth : ''}
        </div>
      */}
        <div
          ref={(c) => {
            this.mediaElement = c;
          }}
          className={classNames('mediaplayer', { 'media-edit-mode': isEditMode })}
          onKeyDown={utils.keyboardControls.bind(null, media)}
        >
          <Player
            ref={(c) => {
              this.player = c;
            }}
            onVolumeChange={this.state.persistenceFn}
            src={item.src}
            vendor={isVideo ? 'video' : 'audio'}
            autoPlay={autoPlay}
            onReady={this.onPlayerReady}
            preload="auto"
            onError={this.onError}
            onPause={this.onPause}
            onPlay={this.onPlay}
            onTimeUpdate={this.handleTimeUpdate}
            defaultCurrentTime={sliceStart || 0}
          />
          <div className='mediaplayer__wrapper'>

            <div className={classNames('mediaplayer__controls', {
              'mediaplayer__controls--is-fade': !controlsVisible && !forceShowControls
            })}
                 onMouseEnter={this.controlsEnter}
                 onMouseLeave={this.controlsLeave}
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
              <div className='mediaplayer__spacer' />
              <AVJumpBack jumpSpan={-5} />
              <AVJumpBack jumpSpan={5} />
              <AvSeekBar
                buffers={this.buffers()}
                playerMode={mode}
                sliceStart={sliceStart}
                sliceEnd={sliceEnd}
                onSliceStartChange={this.handleSliceStartChange}
                onSliceEndChange={this.handleSliceEndChange}
                isMobile={isMobile}
              />

              {
                !isEditMode && (
                  <AVPlaybackRate
                    value={playbackRate}
                    onSelect={this.playbackRateChange}
                    upward={isVideo}
                  />
                )
              }
              <AVMuteUnmute upward={isVideo} />
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
                    upward={isVideo}
                    t={t}
                  />
                )
              }
              {isSliceable && !isEditMode && <AVEditSlice onActivateSlice={() => this.setSliceMode(true)} />}
              {!isEditMode && !isAudio && <AVFullScreen container={this.mediaElement} />}
            </div>
            <div
              className="mediaplayer__onscreen-controls"
              // style={!error ? "{ outline: 'none' }" : { backgroundColor: 'black'}}
              role="button"
              tabIndex="0"
              onClick={this.playPause}
              onKeyDown={this.onKeyDown}
              onMouseMove={this.centerMove}
            >
              {centerMediaControl}
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default withIsMobile(withMediaProps(withRouter(AVPlayerRMP)));

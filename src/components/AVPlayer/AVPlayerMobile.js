import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';
import { Icon, Message } from 'semantic-ui-react';

import { MT_AUDIO, MT_VIDEO } from '../../helpers/consts';
import { fromHumanReadableTime } from '../../helpers/time';
import { getQuery } from '../../helpers/url';
import * as shapes from '../shapes';
import { PLAYER_MODE } from './constants';
import AVPlayPause from './AVPlayPause';
import AVLanguageMobile from './AVLanguageMobile';
import AVAudioVideo from './AVAudioVideo';
import AVEditSlice from './AVEditSlice';
import ShareFormMobile from './Share/ShareFormMobile';

const DEFAULT_PLAYER_VOLUME       = 0.8;
const PLAYER_VOLUME_STORAGE_KEY   = '@@kmedia_player_volume';
const PLAYER_POSITION_STORAGE_KEY = '@@kmedia_player_position';

class AVPlayerMobile extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,

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
    showNextPrev: PropTypes.bool,
    hasNext: PropTypes.bool,
    hasPrev: PropTypes.bool,
    onFinish: PropTypes.func,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,

    // deviceInfo: shapes.UserAgentParserResults.isRequired,
  };

  static defaultProps = {
    showNextPrev: false,
    hasNext: false,
    hasPrev: false,
    onFinish: noop,
    onPrev: noop,
    onNext: noop,
  };

  state = {
    error: false,
    errorReason: '',
    mode: PLAYER_MODE.NORMAL,
    isSliceMode: false,
    currentTime: 0,
  };

  componentWillMount() {
    const { history } = this.props;

    let sliceStart = 0;
    let sliceEnd   = Infinity;

    let mode    = PLAYER_MODE.NORMAL;
    const query = getQuery(history.location);

    if (query.sstart) {
      mode       = PLAYER_MODE.SLICE_VIEW;
      sliceStart = fromHumanReadableTime(query.sstart).asSeconds();
    }

    if (query.send) {
      mode     = PLAYER_MODE.SLICE_VIEW;
      sliceEnd = fromHumanReadableTime(query.send).asSeconds();
    }

    this.setState({ sliceStart, sliceEnd, mode });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.props.item) {
      this.setState({ error: false, errorReason: '' });
    }
  }

  onSwitchAV = (...params) => {
    // We only keep the current time.
    // Playing state is irrelevant on mobile due to user gesture finish
    // prior to media element presence on the page
    this.wasCurrentTime = this.media.currentTime;
    this.props.onSwitchAV(...params);
  };

  // Remember the current time and playing state while switching.
  onLanguageChange = (...params) => {
    this.wasCurrentTime = this.media.currentTime;
    this.props.onLanguageChange(...params);
  };

  handleMediaRef = (ref) => {
    if (ref) {
      this.media = ref;
      this.media.addEventListener('play', this.handlePlay);
      this.media.addEventListener('pause', this.handlePause);
      this.media.addEventListener('ended', this.handleEnded);
      this.media.addEventListener('error', this.handleError);
      this.media.addEventListener('timeupdate', this.handleTimeUpdate);
      this.media.addEventListener('volumechange', this.handleVolumeChange);
      this.media.addEventListener('playing', this.handlePlaying);
      this.media.addEventListener('seeking', this.handleSeeking);
      this.media.addEventListener('canplay', this.seekIfNeeded);
      this.restoreVolume();

    } else if (this.media) {
      this.media.removeEventListener('play', this.handlePlay);
      this.media.removeEventListener('pause', this.handlePause);
      this.media.removeEventListener('ended', this.handleEnded);
      this.media.removeEventListener('error', this.handleError);
      this.media.removeEventListener('timeupdate', this.handleTimeUpdate);
      this.media.removeEventListener('volumechange', this.handleVolumeChange);
      this.media.removeEventListener('playing', this.handlePlaying);
      this.media.removeEventListener('seeking', this.handleSeeking);
      this.media.removeEventListener('canplay', this.seekIfNeeded);
      this.media = ref;
    }
  };

  handlePlay = () => {
    // this.seekIfNeeded();

    // make future src changes autoplay
    this.media.autoplay = true;
  };

  handleVolumeChange = (e) => {
    this.persistVolume(e.currentTarget.volume);
  };

  persistVolume = debounce((value) => {
    localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, value);
  }, 200);

  restoreVolume = () => {
    let value = localStorage.getItem(PLAYER_VOLUME_STORAGE_KEY);
    if (value == null || Number.isNaN(value)) {
      value = DEFAULT_PLAYER_VOLUME;
      localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, value);
    }

    this.media.volume = value;
  };

  seekIfNeeded = () => {
    const { sliceStart } = this.state;
    if (this.wasCurrentTime) {
      this.media.currentTime = this.wasCurrentTime;
      this.wasCurrentTime    = undefined;
    } else if (!sliceStart && this.media.currentTime === 0) {
      const savedTime = this.getSavedTime();
      if (savedTime) {
        this.media.currentTime = savedTime;
      }
    } else if (sliceStart && this.media.currentTime === 0) {
      this.media.currentTime = sliceStart;
    }
  };

  // iosSliceFix is not relevant anymore because the seek has been change to 'canplay' event instead of 'play' event
  /*
    iosSliceFix = () => {
    const { sliceStart } = this.state;
    if (!sliceStart) {
      return;
    }

    const { deviceInfo } = this.props;
    if (deviceInfo.os.name !== 'iOS') {
      console.log('iosSliceFix: not iOS');
      return;
    }

    console.log('iosSliceFix: iOS detected');

    // if the player has enough data we can set the currentTime and be done with it
    if (this.media.readyState > 3) {
      console.log('readyState > 3');
      this.media.currentTime = sliceStart;
      return;
    }

    console.log('readyState:', this.media.readyState);

    const canplaythroughHandler = () => {
      console.log('iosSliceFix: canplaythrough');
      const progressHandler = () => {
        console.log('iosSliceFix: progress');
        this.media.currentTime = sliceStart;
      };

      this.media.addEventListener('progress', progressHandler, { once: true });
    };

    this.media.addEventListener('canplaythrough', canplaythroughHandler, { once: true });
  };
  */

  handlePlaying = () => {
    // this.iosSliceFix();
  };

  handleSeeking = (e) => {
    const { mode, sliceStart, sliceEnd } = this.state;

    if (mode !== PLAYER_MODE.SLICE_VIEW) {
      return;
    }

    // break slice view mode once the user is seeking out side of slice
    const time = e.currentTarget.currentTime;
    if (time < sliceStart || time > sliceEnd) {
      this.setState({
        mode: PLAYER_MODE.NORMAL,
        sliceStart: undefined,
        sliceEnd: undefined,
      });
    }
  };

  handlePause = () => {
    // stop future src changes from autoplay.
    // The exception is paused event fires before ended event
    // In playlist mode we need to move on to next item.
    // so we don't change the autoplay value in such cases.
    if (Math.abs(this.media.currentTime - this.media.duration) > 0.1) {
      this.media.autoplay = false;
      this.saveCurrentTime(this.media.currentTime);
      // updateQuery(this.props.history, q => ({ ...q, currentTime: this.media.currentTime }));
    }
  };

  handleEnded = () => {
    if (this.props.onFinish) {
      this.props.onFinish();
    }
  };

  handleTimeUpdate = (e) => {
    const { mode, sliceEnd } = this.state;

    const time = e.currentTarget.currentTime;

    this.saveCurrentTime(time);

    if (mode !== PLAYER_MODE.SLICE_VIEW) {
      return;
    }

    if (time > sliceEnd) {
      this.media.pause();
    }
  };

  handleError = (e) => {
    const { t } = this.props;
    // Show error only on loading of video.
    if (!e.currentTarget.currentTime && this.media.paused) {
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

  seekTo = (t) => {
    this.media.currentTime = t;
  };

  toggleSliceMode = () =>
    this.setState({ isSliceMode: !this.state.isSliceMode });

  handleJumpBack = () => {
    const { currentTime, duration } = this.media;

    const jumpTo = Math.max(0, Math.min(currentTime - 5, duration));
    this.seekTo(jumpTo);
  };

  handleJumpForward = () => {
    const { currentTime, duration } = this.media;

    const jumpTo = Math.max(0, Math.min(currentTime + 5, duration));
    this.seekTo(jumpTo);
  };

  saveCurrentTime = (mediaTime) => {
    const { currentTime }  = this.state;
    const { item }         = this.props;
    const currentMediaTime = Math.round(mediaTime);
    if (currentMediaTime > 0 && currentMediaTime !== currentTime) {
      this.setState({ currentTime: currentMediaTime });
      if (item.src) {
        localStorage.setItem(`${PLAYER_POSITION_STORAGE_KEY}_${item.src}`, currentMediaTime);
      }
    }
  };

  getSavedTime = () => {
    const { item } = this.props;
    // Try to get the current time from local storage if available
    if (item.src) {
      const savedTime = localStorage.getItem(`${PLAYER_POSITION_STORAGE_KEY}_${item.src}`);
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
        language,
        t,
        showNextPrev,
        hasNext,
        hasPrev,
        onPrev,
        onNext,
      } = this.props;

    const { error, errorReason, isSliceMode } = this.state;

    const isVideo       = item.mediaType === MT_VIDEO;
    const isAudio       = item.mediaType === MT_AUDIO;
    const fallbackMedia = item.mediaType !== item.requestedMediaType;

    if (!item.src) {
      return <Message warning>{t('messages.no-playable-files')}</Message>;
    }

    let mediaEl;

    if (isVideo) {
      mediaEl = (
        <video
          controls
          playsInline
          ref={this.handleMediaRef}
          src={item.src}
          preload="metadata"
          poster={item.preImageUrl}
        />
      );
    } else {
      mediaEl = (
        <audio
          controls
          ref={this.handleMediaRef}
          src={item.src}
          preload="metadata"
        />
      );
    }

    return (
      <div className="mediaplayer">
        <div style={{ marginBottom: '0px' }}>{mediaEl}</div>
        {
          error ?
            <div className="player-button">
              {t('player.error.loading')}
              {errorReason ? ` ${errorReason}` : ''}
              &nbsp;
              <Icon name="warning sign" size="large" />
            </div> :
            null
        }

        <div className="mediaplayer__wrapper">
          <div className="mediaplayer__controls">
            <AVPlayPause
              withoutPlay
              media={{
                isLoading: false,
              }}
              showNextPrev={showNextPrev}
              hasNext={hasNext}
              hasPrev={hasPrev}
              onPrev={onPrev}
              onNext={onNext}
            />
            <div className="mediaplayer__spacer" />
            <AVEditSlice onActivateSlice={this.toggleSliceMode} />
            <button type="button" tabIndex="-1" onClick={this.handleJumpBack}>
              -5s
              <Icon name="backward" />
            </button>
            <button type="button" tabIndex="-1" onClick={this.handleJumpForward}>
              <Icon name="forward" />
              +5s
            </button>
            <AVAudioVideo
              isAudio={isAudio}
              isVideo={isVideo}
              onSwitch={this.onSwitchAV}
              fallbackMedia={fallbackMedia}
              t={t}
            />
            <AVLanguageMobile
              languages={languages}
              language={language}
              requestedLanguage={item.requestedLanguage}
              onSelect={this.onLanguageChange}
              t={t}
            />
          </div>
        </div>

        {
          isSliceMode ?
            <ShareFormMobile media={this.media} item={item} t={t} /> :
            null
        }
      </div>
    );
  }
}

export default withRouter(AVPlayerMobile);

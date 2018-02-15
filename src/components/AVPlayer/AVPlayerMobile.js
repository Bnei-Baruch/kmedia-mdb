import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';
import { Icon, Message } from 'semantic-ui-react';

import { MT_AUDIO, MT_VIDEO } from '../../helpers/consts';
import { getQuery } from '../../helpers/url';
import { fromHumanReadableTime } from '../../helpers/time';
import { PLAYER_MODE } from './constants';
import AVPlayPause from './AVPlayPause';
import AVLanguage from './AVLanguage';
import AVAudioVideo from './AVAudioVideo';
import AVEditSlice from './AVEditSlice';
import ShareFormMobile from './ShareFormMobile';

const PLAYER_VOLUME_STORAGE_KEY = '@@kmedia_player_volume';
const DEFAULT_PLAYER_VOLUME     = 0.8;

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
    error: false,
    errorReason: '',
    mode: PLAYER_MODE.NORMAL,
    isSliceMode: false,
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

  activatePersistence = () => {
    let persistedVolume = localStorage.getItem(PLAYER_VOLUME_STORAGE_KEY);

    if (persistedVolume == null || Number.isNaN(persistedVolume)) {
      persistedVolume = DEFAULT_PLAYER_VOLUME;
      localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, persistedVolume);
    }
    this.media.volume = persistedVolume;
  };

  // Remember the current time and not paused while switching.
  onSwitchAV = (...params) => {
    const { currentTime, paused } = this.media;
    const { onSwitchAV }          = this.props;
    this.media                    = null;
    this.setState({ wasCurrentTime: currentTime, wasPlaying: !paused, isReady: false }, () => {
      onSwitchAV(...params);
    });
  };

  // Remember the current time and not paused while switching.
  onLanguageChange = (...params) => {
    const { currentTime, paused } = this.media;
    const { onLanguageChange }    = this.props;
    this.media                    = null;
    this.setState({ wasCurrentTime: currentTime, wasPlaying: !paused, isReady: false }, () => {
      onLanguageChange(...params);
    });
  };

  handleMediaRef = (ref) => {
    if (ref) {
      this.media = ref;
      this.media.addEventListener('play', this.handlePlay);
      this.media.addEventListener('pause', this.handlePause);
      this.media.addEventListener('error', this.handleError);
      this.media.addEventListener('timeupdate', this.handleTimeUpdate);
      this.media.addEventListener('volumechange', this.handleVolumeChange);

      this.activatePersistence();
      this.initCurrentTime();
    } else if (this.media) {
      this.media.removeEventListener('play', this.handlePlay);
      this.media.removeEventListener('pause', this.handlePause);
      this.media.removeEventListener('error', this.handleError);
      this.media.removeEventListener('timeupdate', this.handleTimeUpdate);
      this.media.removeEventListener('volumechange', this.handleVolumeChange);
      this.media = ref;
    }
  };

  handlePlay         = () => {
  };
  handleVolumeChange = () => {
    debounce(() => localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, this.media.volume), 200);
  };

  initCurrentTime = () => {
    const { wasCurrentTime, wasPlaying, sliceStart, isReady } = this.state;
    if (isReady) {
      return;
    }

    if (wasCurrentTime) {
      this.media.currentTime = wasCurrentTime;
    } else if (sliceStart) {
      this.media.currentTime = sliceStart;
    }

    if (wasPlaying) {
      this.media.play();
    }

    this.setState({ wasCurrentTime: undefined, wasPlaying: undefined, isReady: true });
  };

  handlePause = () => {
    if (this.props.onFinish && Math.abs(this.media.currentTime - this.media.duration) < 0.1) {
      this.props.onFinish();
    }
  };

  handleTimeUpdate = (e) => {
    const { mode, sliceEnd } = this.state;
    if (mode !== PLAYER_MODE.SLICE_VIEW) {
      return;
    }

    const time      = e.currentTarget.currentTime;
    const lowerTime = Math.min(sliceEnd, time);
    if (lowerTime < sliceEnd && (sliceEnd - lowerTime < 0.5)) {
      this.media.pause();
      this.seekTo(sliceEnd);
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
          poster={item.preImageUrl}
          autoPlay={autoPlay}
        />
      );
    } else {
      mediaEl = (
        <audio
          controls
          ref={this.handleMediaRef}
          src={item.src}
        />
      );
    }

    let control;
    let slicer;
    if (error) {
      control = (
        <div className="player-button">
          {t('player.error.loading')}
          {errorReason ? ` ${errorReason}` : ''}
          &nbsp;
          <Icon name="warning sign" size="large" />
        </div>
      );
    } else if (this.state.isReady) {
      control = (
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
            <AVEditSlice onActivateSlice={this.toggleSliceMode} isActive={isSliceMode} />

            <AVAudioVideo
              isAudio={isAudio}
              isVideo={isVideo}
              onSwitch={this.onSwitchAV}
              fallbackMedia={fallbackMedia}
              t={t}
            />
            <AVLanguage
              languages={languages}
              language={language}
              position="bottom"
              requestedLanguage={item.requestedLanguage}
              onSelect={this.onLanguageChange}
              t={t}
            />
          </div>
        </div>
      );
      slicer  = isSliceMode ? <ShareFormMobile currentTime={this.media.currentTime || 0} /> : null;
    }
    return (
      <div className="mediaplayer">
        <div style={{ marginBottom: '0px' }}>{mediaEl}</div>
        {control}
        {slicer}
      </div>
    );
  }
}

export default withRouter(AVPlayerMobile);

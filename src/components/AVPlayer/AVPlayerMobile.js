import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Icon } from 'semantic-ui-react';

import { MT_AUDIO, MT_VIDEO } from '../../helpers/consts';
import { getQuery } from '../../helpers/url';
import { fromHumanReadableTime } from '../../helpers/time';
import { PLAYER_MODE } from './constants';
import { AVPlayPause } from './AVPlayPause';
import AVLanguage from './AVLanguage';
import AVAudioVideo from './AVAudioVideo';

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
    persistenceFn: noop
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

    if (persistedVolume == null || isNaN(persistedVolume)) {
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

  handleMediaHtmlInit = (el) => {
    if (!el || this.media) {
      return;
    }
    const { wasCurrentTime, wasPlaying, sliceStart } = this.state;
    this.media                                       = el;
    this.initEventListeners(el);

    this.activatePersistence();

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

  initEventListeners = (el) => {
    el.onplay         = this.updateMedia;
    el.onpause        = this.updateMedia;
    el.onerror        = this.onError;
    el.ontimeupdate   = this.handleTimeUpdate;
    el.onvolumechange = debounce(media => localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, this.media.volume), 200);
  };

  handleTimeUpdate = (timeData) => {
    const { mode, sliceEnd } = this.state;

    const lowerTime = Math.min(sliceEnd, timeData.currentTarget.currentTime);
    if (mode === PLAYER_MODE.SLICE_VIEW && lowerTime < sliceEnd && (sliceEnd - lowerTime < 0.5)) {
      this.media.pause();
      this.seekTo(sliceEnd);
    }
  };

  onError = (e) => {
    const { t } = this.props;
    // Show error only on loading of video.
    if (!e.currentTime && this.media.paused) {
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
    this.updateMedia();
  };

  updateMedia = () => this.setState({ updateMedia: {} });

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
          }                     = this.props;
    let { error, errorReason, } = this.state;

    const isVideo       = item.mediaType === MT_VIDEO;
    const isAudio       = item.mediaType === MT_AUDIO;
    const fallbackMedia = item.mediaType !== item.requestedMediaType;

    if (!item.src) {
      error       = true;
      errorReason = t('messages.no-playable-files');
    }

    let medeaEl;

    if (isVideo) {
      medeaEl = <video
        style={{ width: 'calc(100% - 90px)' }}
        ref={this.handleMediaHtmlInit}
        controls
        src={item.src}
        poster={item.preImageUrl}
        autoPlay={autoPlay}
      />;
    } else {
      medeaEl = <audio
        src={item.src}
        controls
        ref={this.handleMediaHtmlInit}
      />;
    }

    let control;
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
        <div className="mediaplayer__wrapper" style={{ top: 'auto' }}>
          <div className="mediaplayer__controls">
            <AVPlayPause
              withoutPlay={true}
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
              requestedLanguage={item.requestedLanguage}
              onSelect={this.onLanguageChange}
              t={t}
            />
          </div>
        </div>
      );
    }
    return (
      <div className={classNames('mediaplayer')}>
        <div style={{ marginBottom: '30px' }}>{medeaEl}</div>
        {control}
      </div>
    );
  }
}

export default withRouter(AVPlayerMobile);

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';
import { Icon, Message, Button } from 'semantic-ui-react';

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
import AVPlaybackRateMobile from './AVPlaybackRateMobile';
import AVSpinner from './AVSpinner';
import { RTL_LANGUAGES } from '../../helpers/consts';

const DEFAULT_PLAYER_VOLUME       = 0.8;
const PLAYER_VOLUME_STORAGE_KEY   = '@@kmedia_player_volume';
const PLAYER_POSITION_STORAGE_KEY = '@@kmedia_player_position';

// Converts playback rate string to float: 1.0x => 1.0
const playbackToValue = playback =>
  parseFloat(playback.slice(0, -1));

class AVPlayerMobile extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,

    // Language dropdown props.
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    language: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    uiLanguage: PropTypes.string.isRequired,

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
    onPrev: PropTypes.func,
    onNext: PropTypes.func,

    deviceInfo: shapes.UserAgentParserResults.isRequired,
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
    firstSeek: true,
    seeking: true,
    playbackRate: '1x',
    showControls: false,
    unMuteButton: false,
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

    this.setState({ sliceStart, sliceEnd, mode, firstSeek: true });
  }

  componentWillUnmount() {
    if (this.seekTimeoutId)
      clearTimeout(this.seekTimeoutId);
  }

   componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.props.item) {
      this.setState({ error: false, errorReason: '', firstSeek: true });
    }
  }

  onSwitchAV = (...params) => {
    // We only keep the current time.
    // Playing state is irrelevant on mobile due to user gesture finish
    // prior to media element presence on the page
    this.wasCurrentTime = this.media.currentTime;
    this.props.onSwitchAV(...params);
    //this.media.autoplay = true;
  };

  // Remember the current time and playing state while switching.
  onLanguageChange = (...params) => {
    this.wasCurrentTime = this.media.currentTime;
    this.props.onLanguageChange(...params);
  };

  handleMediaRef = (ref) => {
    if (ref) {
      this.media = ref;      
      if (this.props.autoPlay) {        
        if (this.props.item.mediaType === MT_VIDEO)
          this.media.muted = true;        
        this.media.autoPlay = true;
        this.setState({ unMuteButton : true });
        if (this.props.deviceInfo.os.name === 'iOS')
          setTimeout(this.showControls, 5000);
        else 
          this.showControls();
      }      
      else {
        this.showControls();
        this.restoreVolume();
      }
      this.media.addEventListener('play', this.handlePlay);
      this.media.addEventListener('pause', this.handlePause);
      this.media.addEventListener('ended', this.handleEnded);
      this.media.addEventListener('error', this.handleError);
      this.media.addEventListener('timeupdate', this.handleTimeUpdate);
      this.media.addEventListener('volumechange', this.handleVolumeChange);
      // this.media.addEventListener('playing', this.handlePlaying);
      // this.media.addEventListener('seeking', this.handleSeeking);
      this.media.addEventListener('canplay', this.seekIfNeeded);            
    } else if (this.media) {
      this.media.removeEventListener('play', this.handlePlay);
      this.media.removeEventListener('pause', this.handlePause);
      this.media.removeEventListener('ended', this.handleEnded);
      this.media.removeEventListener('error', this.handleError);
      this.media.removeEventListener('timeupdate', this.handleTimeUpdate);
      this.media.removeEventListener('volumechange', this.handleVolumeChange);
      // this.media.removeEventListener('playing', this.handlePlaying);
      // this.media.removeEventListener('seeking', this.handleSeeking);
      this.media.removeEventListener('canplay', this.seekIfNeeded);
      this.media = ref;
    }
  };

  handlePlay = () => {
    this.seekIfNeeded();

    // make future src changes autoplay
    this.media.autoplay = true;
  };

  handleVolumeChange = (e) => {
    const { firstSeek, unMuteButton } = this.state;
    this.persistVolume(e.currentTarget.volume);    
    if (unMuteButton && !firstSeek)
      this.setState({ unMuteButton: false });    
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
    const { sliceStart, firstSeek, playbackRate } = this.state;
    this.media.playbackRate = playbackToValue(playbackRate);

    if (firstSeek) {
      if (sliceStart) {
        this.seekTo(sliceStart, true);
      } else {
        const savedTime = this.getSavedTime();
        if (savedTime) {
          this.seekTo(savedTime, true);
        }
      }      
      this.setState({ firstSeek: false });          
    } else if (this.wasCurrentTime) {
      this.seekTo(this.wasCurrentTime, true);
      this.wasCurrentTime    = undefined;
    } 
  };

  // handlePlaying = () => {
  // };
  //
  // handleSeeking = (e) => {
  // };

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
      this.clearCurrentTime();
      this.props.onFinish();
    }
  };

  showControls = () => {
    const { showControls } = this.state;
    if (!showControls) {
      this.media.controls = true;    
      this.setState({ showControls: true });   
    }
  }

  handleTimeUpdate = (e) => {
    const { mode, sliceEnd, sliceStart, seeking, firstSeek } = this.state;

    this.showControls();

    const time = e.currentTarget.currentTime;
    this.saveCurrentTime(time);

    if (mode !== PLAYER_MODE.SLICE_VIEW || firstSeek || seeking===true) {
       return;
    }

    const lowerTime = Math.min(sliceEnd, time);

    if (time < sliceStart - 0.5 || time > sliceEnd) {
      this.setState({
        mode: PLAYER_MODE.NORMAL,
        sliceStart: undefined,
        sliceEnd: undefined,
      });
    } else if (lowerTime < sliceEnd && (sliceEnd - lowerTime < 0.5)) {
      this.media.pause();
      this.seekTo(sliceEnd, false);
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

  seekTo = (t, force) => {        
    this.media.currentTime = t;           
    if (this.props.deviceInfo.browser.name !== 'Samsung Browser') {
      this.setState({ seeking: false });  
      return;
    }

    this.setState({ seeking: true });
    // If seek not success, do a seek timeout (bug fix for android internal browser)
    if (force && !this.isSeekSuccess(t))
      this.seekTimeout(t, 250);
    else
      this.setState({ seeking: false });
  };

  seekTimeout = (t, timeout) => {   
    if (this.seekTimeoutId)
      clearTimeout(this.seekTimeoutId);
    this.seekTimeoutId = setTimeout(()=> {
      if (this.isSeekSuccess(t)) {
        this.setState({ seeking: false });
        return;
      }
      this.media.currentTime = t;
      if (!this.isSeekSuccess(t))
          this.seekTimeout(t, timeout);
      else
          this.setState({ seeking: false });
    }, timeout);
  };

  isSeekSuccess = t =>
    this.media.currentTime >= t;

  toggleSliceMode = () =>
    this.setState({ isSliceMode: !this.state.isSliceMode });

  handleJumpBack = () => {
    const { currentTime, duration } = this.media;

    const jumpTo = Math.max(0, Math.min(currentTime - 5, duration));
    this.seekTo(jumpTo, false);
  };

  handleJumpForward = () => {
    const { currentTime, duration } = this.media;

    const jumpTo = Math.max(0, Math.min(currentTime + 5, duration));
    this.seekTo(jumpTo, false);
  };

  saveCurrentTime = (mediaTime) => {
    const { currentTime, firstSeek } = this.state;
    const { item }                   = this.props;
    const currentMediaTime           = Math.round(mediaTime);
    if (!firstSeek && currentMediaTime !== currentTime) {
      this.setState({ currentTime: currentMediaTime });
      if (item && item.unit && item.unit.id) {
        localStorage.setItem(`${PLAYER_POSITION_STORAGE_KEY}_${item.unit.id}`, currentMediaTime);
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

  playbackRateChange = (e, rate) => {
    this.media.playbackRate = playbackToValue(rate);
    this.setState({ playbackRate: rate });
  };

  unMute = () => {    
    if (this.media && this.media.muted) {
      this.media.muted = false;
      this.setState({ unMuteButton: false });
    }
  }

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
        uiLanguage,
      } = this.props;

    const { error, errorReason, isSliceMode, playbackRate, unMuteButton, showControls} = this.state;

    const isVideo       = item.mediaType === MT_VIDEO;
    const isAudio       = item.mediaType === MT_AUDIO;
    const fallbackMedia = item.mediaType !== item.requestedMediaType;
    const isRtl         = RTL_LANGUAGES.includes(uiLanguage);


    if (!item.src) {
      return <Message warning>{t('messages.no-playable-files')}</Message>;
    }

    let mediaEl;    

    if (isVideo) {
      mediaEl = this.props.autoPlay ? (
        <video          
          autoPlay
          playsInline
          ref={this.handleMediaRef}
          src={item.src}
          preload="metadata"
          poster={item.preImageUrl}
        ></video>
      ) : (
        <video
          playsInline
          ref={this.handleMediaRef}
          src={item.src}
          preload="metadata"
          poster={item.preImageUrl}
        ></video>
      );
    } else {
      mediaEl = this.props.autoPlay ? (
        <audio
          controls
          autoPlay
          ref={this.handleMediaRef}
          src={item.src}
          preload="metadata"
        ></audio>
      ) : (
        <audio
          controls          
          ref={this.handleMediaRef}
          src={item.src}
          preload="metadata"
        ></audio>
      );
    }

    return (
      <div className="mediaplayer">
        <div style={{ marginBottom: '0px' }}>{mediaEl}</div>
        {
          error ?
            <div className="player-button player-error-message">
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
                showControls: false,
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
            <AVPlaybackRateMobile
              value={playbackRate}
              onSelect={this.playbackRateChange}
            />
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
        { 
          isVideo && unMuteButton ? 
          <Button 
            icon="volume off"
            className={isRtl ? 'mediaplayer__mobileUnmuteButton rtl' : 'mediaplayer__mobileUnmuteButton'}
            content={t('player.buttons.tap-to-unmute')} 
            onClick={this.unMute} /> :
          null          
        }
        {
          !showControls ?
          <div className="mediaplayer__mobileLoader"><AVSpinner /></div> :
          null
        }
      </div>
    );
  }
}

export default withRouter(AVPlayerMobile);

import { createAction } from 'redux-actions';
import { handleActions } from './settings';
import { JWPLAYER_ID } from '../../helpers/consts';

const PLAYER_READY    = 'Player/READY';
const PLAYER_ACTIVE   = 'Player/PLAYER_ACTIVE';
const PLAYER_INACTIVE = 'Player/PLAYER_INACTIVE';

const PLAYER_PLAY               = 'Player/PLAY';
const PLAYER_PAUSE              = 'Player/PAUSE';
const PLAYER_RATE               = 'Player/RATE';
const PLAYER_MUTE               = 'Player/MUTE';
const PLAYER_VOLUME             = 'Player/VOLUME';
const PLAYER_SET_OVER_MODE      = 'Player/SET_OVER_MODE';
const PLAYER_CONTINUE_PLAY_FROM = 'Player/CONTINUE_PLAY_FROM';

const PLAYER_SHARE_START = 'Player/PLAYER_SHARE_START';
const PLAYER_SHARE_STOP  = 'Player/PLAYER_SHARE_STOP';

export const types = {
  PLAYER_READY,

  PLAYER_PLAY,
  PLAYER_MUTE,
  PLAYER_VOLUME,
};

// Actions
const playerReady    = createAction(PLAYER_READY);
const playerActive   = createAction(PLAYER_ACTIVE);
const playerInactive = createAction(PLAYER_INACTIVE);

const playerPlay   = createAction(PLAYER_PLAY);
const playerPause  = createAction(PLAYER_PAUSE);
const playerRate   = createAction(PLAYER_RATE);
const playerMute   = createAction(PLAYER_MUTE);
const playerVolume = createAction(PLAYER_VOLUME);
const setOverMode  = createAction(PLAYER_SET_OVER_MODE);
const continuePlay = createAction(PLAYER_CONTINUE_PLAY_FROM);

const playerShareStart = createAction(PLAYER_SHARE_START);
const playerShareStop  = createAction(PLAYER_SHARE_STOP);

export const actions = {
  playerReady,
  playerActive,

  playerPlay,
  playerPause,
  playerRate,
  playerMute,
  playerVolume,
  setOverMode,
  continuePlay,

  playerShareStart,
  playerShareStop
};

/* Reducer */
const initialState = { overMode: null, continuePlay: { pos: -1, isPlayed: false } };

const onReady = (draft, e) => {
  console.log('onReady', e);
  if (draft.continuePlay && draft.continuePlay.pos !== -1) {
    const p = window.jwplayer(JWPLAYER_ID);
    p.stop().seek(draft.continuePlay.pos);
    draft.continuePlay.isPlayed ? p.play() : p.pause();

    draft.continuePlay = { pos: -1, isPlayed: false };
    draft.overMode     = null;
  }
};

const onInactive = (draft, payload) => {
  console.log('onInactive', payload);
  draft.controls = false;
};
const onActive   = (draft, payload) => {
  console.log('onActive', payload);
  draft.controls = true;
};

const onPlay = (draft, payload) => {
  console.log('onPlay', payload);
  draft.played = payload;
};

const onPause = (draft, payload) => draft.played = false;

const onRate = (draft, payload) => draft.rate = payload.playbackRate;

const onMute = (draft, payload) => {
  console.log('onMute', payload);
};

const onVolume = (draft, payload) => {
  console.log('onVolume', payload);
};

const onSetOverMode = (draft, payload) => draft.overMode = payload;

const onContinuePlay = (draft, payload = -1) => {
  const p        = window.jwplayer(JWPLAYER_ID);
  const pos      = p.getPosition();
  const isPlayed = p.getState() === 'playing';
  console.log('onContinuePlay', pos, isPlayed);
  draft.continuePlay = { pos, isPlayed };
};

export const reducer = handleActions({
  [PLAYER_READY]: onReady,
  [PLAYER_ACTIVE]: onActive,
  [PLAYER_INACTIVE]: onInactive,

  [PLAYER_PLAY]: onPlay,
  [PLAYER_PAUSE]: onPause,
  [PLAYER_RATE]: onRate,
  [PLAYER_MUTE]: onMute,
  [PLAYER_VOLUME]: onVolume,

  [PLAYER_SET_OVER_MODE]: onSetOverMode,
  [PLAYER_CONTINUE_PLAY_FROM]: onContinuePlay,

  [PLAYER_SHARE_START]: (draft, payload) => draft.start = payload,
  [PLAYER_SHARE_STOP]: (draft, payload) => draft.stop = payload,
}, initialState);

const isControls   = state => state.controls;
const isAudio      = state => state.isAudio;
const isPlay       = state => state.played;
const getOverMode  = state => state.overMode;
const getRate      = state => state.rate || 1;
const getStartStop = ({ start, stop }) => ({ start, stop });

export const selectors = {
  isControls,
  isAudio,
  isPlay,
  getOverMode,
  getRate,
  getStartStop,
};

export const PLAYER_ACTIONS_BY_EVENT = {
  'ready': playerReady,
  'userInactive': playerInactive,
  'userActive': playerActive,
  'play': playerPlay,
  'playbackRateChanged': playerRate,
  'pause': playerPause,
  'mute': playerMute,
  'volume': playerVolume
};

import { createAction } from 'redux-actions';
import { handleActions } from './settings';
import { PLAYER_OVER_MODES } from '../../helpers/consts';

const PLAYER_READY       = 'Player/READY';
const PLAYER_REMOVE      = 'Player/REMOVE';
const PLAYER_PLAY        = 'Player/PLAY';
const PLAYER_PAUSE       = 'Player/PAUSE';
const PLAYER_RATE        = 'Player/RATE';
const PLAYER_RESIZE      = 'Player/RESIZE';
const PLAYER_MUTE_UNMUTE = 'Player/MUTE_UNMUTE';

const PLAYER_SET_FILE          = 'Player/SET_FILE';
const PLAYER_SET_OVER_MODE     = 'Player/SET_OVER_MODE';
const PLAYER_SET_IS_FULLSCREEN = 'Player/SET_IS_FULLSCREEN';
const PLAYER_SET_LOADED        = 'Player/SET_LOADED';
const PLAYER_SET_WIP           = 'Player/SET_WIP';

const SET_SHARE_START_END = 'Player/SET_SHARE_START_END';

export const types = {
  PLAYER_PLAY,
  PLAYER_PAUSE,
  PLAYER_MUTE_UNMUTE,
  PLAYER_REMOVE
};

// Actions
const playerReady  = createAction(PLAYER_READY);
const playerRemove = createAction(PLAYER_REMOVE);
const setFile      = createAction(PLAYER_SET_FILE);

const playerPlay       = createAction(PLAYER_PLAY);
const playerPause      = createAction(PLAYER_PAUSE);
const playerRate       = createAction(PLAYER_RATE);
const playerResize     = createAction(PLAYER_RESIZE);
const playerMuteUnmute = createAction(PLAYER_MUTE_UNMUTE);

const setOverMode   = createAction(PLAYER_SET_OVER_MODE);
const setFullScreen = createAction(PLAYER_SET_IS_FULLSCREEN);
const setLoaded     = createAction(PLAYER_SET_LOADED);
const setWIP        = createAction(PLAYER_SET_WIP);

const setShareStartEnd = createAction(SET_SHARE_START_END);

export const actions = {
  setFile,
  setOverMode,
  setShareStartEnd,
  setFullScreen,
  setLoaded,
  setWIP,

  playerPlay,
  playerPause,
};

/* Reducer */
const initialState = {
  overMode: PLAYER_OVER_MODES.firstTime,
  isReady: false,
  file: null,
  shareStartEnd: { start: 0, end: Infinity },
  isFullScreen: false,
  wip: false
};

const onReady = draft => {
  draft.wip    = false;
  draft.ready  = true;
  draft.loaded = false;
};

const onRemove = draft => {
  draft.overMode     = PLAYER_OVER_MODES.firstTime;
  draft.isFullScreen = false;
  draft.ready        = false;
  draft.played       = false;
  draft.wip          = false;
};

const onSetMode = (draft, payload) => {
  draft.overMode      = payload;
  draft.shareStartEnd = initialState.shareStartEnd;
};

const onSetFile = (draft, payload) => {
  //fix preload bug
  if (draft.file?.id !== payload.id) {
    draft.played = false;
    draft.loaded = false;
  }
  draft.file = payload;
};

const onPlay = (draft, payload) => {
  draft.played = payload.newstate === 'playing';
  if (draft.overMode === PLAYER_OVER_MODES.firstTime)
    draft.overMode = PLAYER_OVER_MODES.active;
};

export const reducer = handleActions({
  [PLAYER_READY]: onReady,
  [PLAYER_REMOVE]: onRemove,
  [PLAYER_SET_FILE]: onSetFile,

  [PLAYER_PLAY]: onPlay,
  [PLAYER_PAUSE]: draft => draft.played = false,
  [PLAYER_RATE]: (draft, payload) => draft.rate = payload.playbackRate,
  [PLAYER_RESIZE]: (draft, payload) => draft.width = payload.width,
  [PLAYER_MUTE_UNMUTE]: (draft, payload) => draft.muteUnmute = payload,

  [PLAYER_SET_OVER_MODE]: onSetMode,
  [PLAYER_SET_IS_FULLSCREEN]: (draft, payload) => draft.isFullScreen = payload,
  [PLAYER_SET_LOADED]: (draft, payload) => draft.loaded = payload,
  [PLAYER_SET_WIP]: (draft, payload) => draft.wip = payload,

  [SET_SHARE_START_END]: (draft, payload) => draft.shareStartEnd = payload
}, initialState);

const isReady          = state => state.ready;
const isLoaded         = state => state.loaded;
const isPlay           = state => state.played;
const getFile          = state => state.file;
const getOverMode      = state => state.overMode;
const getWIP           = state => state.wip;
const isFullScreen     = state => state.isFullScreen;
const getRate          = state => state.rate || 1;
const getShareStartEnd = state => state.shareStartEnd;
const getPlayerWidth   = state => state.width;

export const selectors = {
  isReady,
  isLoaded,
  isPlay,
  getFile,
  getOverMode,
  getWIP,
  isFullScreen,
  getRate,
  getShareStartEnd,
  getPlayerWidth,
};

export const PLAYER_ACTIONS_BY_EVENT = {
  'ready': playerReady,
  'remove': playerRemove,
  'play': playerPlay,
  'playbackRateChanged': playerRate,
  'pause': playerPause,
  'resize': playerResize,
  'mute': playerMuteUnmute,
};

import { createAction } from 'redux-actions';
import { handleActions } from './settings';
import { PLAYER_OVER_MODES } from '../../helpers/consts';
import { LOCALSTORAGE_MUTE } from '../../pkg/jwpAdapter/adapter';

const PLAYER_READY       = 'Player/READY';
const PLAYER_REMOVE      = 'Player/REMOVE';
const PLAYER_PLAY        = 'Player/PLAY';
const PLAYER_BUFFER      = 'Player/BUFFER';
const PLAYER_PAUSE       = 'Player/PAUSE';
const PLAYER_RATE        = 'Player/RATE';
const PLAYER_RESIZE      = 'Player/RESIZE';
const PLAYER_TOGGLE_MUTE = 'Player/TOGGLE_MUTE';
const PLAYER_COMPLETE    = 'Player/COMPLETE';

const PLAYER_SET_FILE          = 'Player/SET_FILE';
const PLAYER_SET_OVER_MODE     = 'Player/SET_OVER_MODE';
const PLAYER_SET_IS_FULLSCREEN = 'Player/SET_IS_FULLSCREEN';
const PLAYER_SET_LOADED        = 'Player/SET_LOADED';
const PLAYER_SET_WIP           = 'Player/SET_WIP';

const SET_SHARE_START_END = 'Player/SET_SHARE_START_END';
const SET_IS_MUTED        = 'Player/SET_IS_MUTED';

export const types = {
  PLAYER_PLAY,
  PLAYER_PAUSE,
  PLAYER_TOGGLE_MUTE,
  PLAYER_REMOVE,
  PLAYER_COMPLETE
};

// Actions
const playerReady  = createAction(PLAYER_READY);
const playerRemove = createAction(PLAYER_REMOVE);
const setFile      = createAction(PLAYER_SET_FILE);

const playerPlay       = createAction(PLAYER_PLAY);
const playerBuffer     = createAction(PLAYER_BUFFER);
const playerPause      = createAction(PLAYER_PAUSE);
const playerRate       = createAction(PLAYER_RATE);
const playerResize     = createAction(PLAYER_RESIZE);
const playerToggleMute = createAction(PLAYER_TOGGLE_MUTE);
const playerComplete   = createAction(PLAYER_COMPLETE);

const setOverMode   = createAction(PLAYER_SET_OVER_MODE);
const setFullScreen = createAction(PLAYER_SET_IS_FULLSCREEN);
const setLoaded     = createAction(PLAYER_SET_LOADED);
const setWIP        = createAction(PLAYER_SET_WIP);

const setShareStartEnd = createAction(SET_SHARE_START_END);
const setIsMuted       = createAction(SET_IS_MUTED);

export const actions = {
  setFile,
  setOverMode,
  setShareStartEnd,
  setFullScreen,
  setLoaded,
  setWIP,

  playerPlay,
  playerPause,
  setIsMuted
};

/* Reducer */
const initialState = {
  overMode: PLAYER_OVER_MODES.firstTime,
  isReady: false,
  file: null,
  shareStartEnd: { start: 0, end: Infinity },
  isFullScreen: false,
  wip: false,
  isMuted: localStorage.getItem(LOCALSTORAGE_MUTE) === 'true'
};

const onReady = draft => {
  draft.wip   = false;
  draft.ready = true;
};

const onRemove = draft => {
  draft.overMode = PLAYER_OVER_MODES.firstTime;
  //draft.isFullScreen = false;
  draft.ready    = false;
  draft.played   = false;
  draft.wip      = false;
};

const onSetMode = (draft, payload) => {
  draft.overMode = payload;
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
  draft.loaded = true;
  if (draft.overMode === PLAYER_OVER_MODES.firstTime)
    draft.overMode = PLAYER_OVER_MODES.active;
};

export const reducer = handleActions({
  [PLAYER_READY]: onReady,
  [PLAYER_REMOVE]: onRemove,
  [PLAYER_SET_FILE]: onSetFile,

  [PLAYER_PLAY]: onPlay,
  [PLAYER_PAUSE]: draft => draft.played = false,
  [PLAYER_BUFFER]: draft => draft.loaded = false,
  [PLAYER_RATE]: (draft, payload) => draft.rate = payload.playbackRate,
  [PLAYER_RESIZE]: (draft, payload) => draft.width = payload.width,
  [PLAYER_TOGGLE_MUTE]: (draft, payload) => draft.isMuted = payload.mute,

  [PLAYER_SET_OVER_MODE]: onSetMode,
  [PLAYER_SET_IS_FULLSCREEN]: (draft, payload) => draft.isFullScreen = payload,
  [PLAYER_SET_LOADED]: (draft, payload) => draft.loaded = payload,
  [PLAYER_SET_WIP]: (draft, payload) => draft.wip = payload,

  [SET_SHARE_START_END]: (draft, payload) => draft.shareStartEnd = payload,
  [SET_IS_MUTED]: (draft, payload) => draft.isMuted = payload,

  //[settings.SET_LANGUAGE]: onRemove,
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
const isMuted          = state => state.isMuted;

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
  isMuted
};

export const PLAYER_ACTIONS_BY_EVENT = {
  'ready': playerReady,
  'destroyPlugin': playerRemove,
  'buffer': playerBuffer,
  'play': playerPlay,
  'playbackRateChanged': playerRate,
  'pause': playerPause,
  'resize': playerResize,
  'mute': playerToggleMute,
  'complete': playerComplete,
};

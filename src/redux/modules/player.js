import { createAction } from 'redux-actions';
import { handleActions } from './settings';
import { PLAYER_OVER_MODES } from '../../helpers/consts';

const PLAYER_READY          = 'Player/READY';
const PLAYER_REMOVE         = 'Player/REMOVE';
const PLAYER_PLAY           = 'Player/PLAY';
const PLAYER_PAUSE          = 'Player/PAUSE';
const PLAYER_RATE           = 'Player/RATE';
const PLAYER_RESIZE         = 'Player/RESIZE';
const PLAYER_MUTE_UNMUTE    = 'Player/MUTE_UNMUTE';
const PLAYER_DESTROY_PLUGIN = 'Player/DESTROY_PLUGIN';

const PLAYER_SET_FILE          = 'Player/SET_FILE';
const PLAYER_SET_OVER_MODE     = 'Player/SET_OVER_MODE';
const PLAYER_SET_IS_FULLSCREEN = 'Player/SET_IS_FULLSCREEN';

const SET_SHARE_START_END = 'Player/SET_SHARE_START_END';

export const types = {
  PLAYER_PLAY,
  PLAYER_PAUSE,
  PLAYER_MUTE_UNMUTE,
  PLAYER_REMOVE,
  PLAYER_DESTROY_PLUGIN
};

// Actions
const playerReady  = createAction(PLAYER_READY);
const playerRemove = createAction(PLAYER_REMOVE);
const setFile      = createAction(PLAYER_SET_FILE);

const playerPlay          = createAction(PLAYER_PLAY);
const playerPause         = createAction(PLAYER_PAUSE);
const playerRate          = createAction(PLAYER_RATE);
const playerResize        = createAction(PLAYER_RESIZE);
const playerMuteUnmute    = createAction(PLAYER_MUTE_UNMUTE);
const playerDestroyPlugin = createAction(PLAYER_DESTROY_PLUGIN);

const setOverMode   = createAction(PLAYER_SET_OVER_MODE);
const setFullScreen = createAction(PLAYER_SET_IS_FULLSCREEN);

const setShareStartEnd = createAction(SET_SHARE_START_END);

export const actions = {
  setFile,
  setOverMode,
  setShareStartEnd,
  setFullScreen,

  playerPlay,
  playerPause,
};

/* Reducer */
const initialState = {
  overMode: PLAYER_OVER_MODES.firstTime,
  isReady: false,
  file: null,
  shareStartEnd: { start: 0, end: Infinity },
  isFullScreen: false
};

const onRemove = draft => {
  draft.overMode     = PLAYER_OVER_MODES.firstTime;
  draft.isFullScreen = false;
  draft.ready        = false;
};

const onSetMode = (draft, payload) => {
  draft.overMode      = payload;
  draft.shareStartEnd = initialState.shareStartEnd;
};

export const reducer = handleActions({
  [PLAYER_READY]: draft => draft.ready = true,
  [PLAYER_REMOVE]: onRemove,
  [PLAYER_SET_FILE]: (draft, payload) => draft.file = payload,

  [PLAYER_PLAY]: (draft, payload) => {
    draft.played = payload.newstate === 'playing';
    if (draft.overMode === PLAYER_OVER_MODES.firstTime)
      draft.overMode = PLAYER_OVER_MODES.active;
  },
  [PLAYER_PAUSE]: draft => draft.played = false,
  [PLAYER_RATE]: (draft, payload) => draft.rate = payload.playbackRate,
  [PLAYER_RESIZE]: (draft, payload) => draft.width = payload.width,
  [PLAYER_MUTE_UNMUTE]: (draft, payload) => draft.muteUnmute = payload,

  [PLAYER_SET_OVER_MODE]: onSetMode,
  [PLAYER_SET_IS_FULLSCREEN]: (draft, payload) => draft.isFullScreen = payload,

  [SET_SHARE_START_END]: (draft, payload) => draft.shareStartEnd = payload
}, initialState);

const isReady          = state => state.ready;
const isPlay           = state => state.played;
const getFile          = state => state.file;
const getOverMode      = state => state.overMode;
const isFullScreen     = state => state.isFullScreen;
const getRate          = state => state.rate || 1;
const getShareStartEnd = state => state.shareStartEnd;
const getPlayerWidth   = state => state.width;

export const selectors = {
  isReady,
  isPlay,
  getFile,
  getOverMode,
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
  'destroyPlugin': playerDestroyPlugin,
};

import { createAction } from 'redux-actions';
import { handleActions } from './settings';
import { PLAYER_OVER_MODES } from '../../helpers/consts';

const PLAYER_READY          = 'Player/READY';
const PLAYER_METADATA_READY = 'Player/PLAYER_METADATA_READY';
const PLAYER_REMOVE         = 'Player/REMOVE';
const DESTROY_PLUGIN        = 'Player/DESTROY_PLUGIN';
const PLAYER_PLAY           = 'Player/PLAY';
const PLAYER_BUFFER         = 'Player/BUFFER';
const PLAYER_PAUSE          = 'Player/PAUSE';
const PLAYER_RATE           = 'Player/RATE';
const PLAYER_RESIZE         = 'Player/RESIZE';
const PLAYER_TOGGLE_MUTE    = 'Player/TOGGLE_MUTE';
const PLAYER_COMPLETE       = 'Player/COMPLETE';

const PLAYER_SET_FILE          = 'Player/SET_FILE';
const PLAYER_SET_OVER_MODE     = 'Player/SET_OVER_MODE';
const PLAYER_SET_IS_FULLSCREEN = 'Player/SET_IS_FULLSCREEN';
const PLAYER_SET_LOADED        = 'Player/SET_LOADED';
const SET_KEYBOARD_COEF        = 'Player/SET_KEYBOARD_COEF';

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
const playerReady         = createAction(PLAYER_READY);
const playerMetadataReady = createAction(PLAYER_METADATA_READY);
const playerRemove        = createAction(PLAYER_REMOVE);
const playerDestroyPlugin = createAction(DESTROY_PLUGIN);
const setFile             = createAction(PLAYER_SET_FILE);

const playerPlay       = createAction(PLAYER_PLAY);
const playerBuffer     = createAction(PLAYER_BUFFER);
const playerPause      = createAction(PLAYER_PAUSE);
const playerRate       = createAction(PLAYER_RATE);
const playerResize     = createAction(PLAYER_RESIZE);
const playerToggleMute = createAction(PLAYER_TOGGLE_MUTE);
const playerComplete   = createAction(PLAYER_COMPLETE);

const setOverMode     = createAction(PLAYER_SET_OVER_MODE);
const setFullScreen   = createAction(PLAYER_SET_IS_FULLSCREEN);
const setLoaded       = createAction(PLAYER_SET_LOADED);
const setKeyboardCoef = createAction(SET_KEYBOARD_COEF);

const setShareStartEnd = createAction(SET_SHARE_START_END);
const setIsMuted       = createAction(SET_IS_MUTED);

export const actions = {
  setFile,
  setOverMode,
  setShareStartEnd,
  setFullScreen,
  setLoaded,
  setKeyboardCoef,

  playerPlay,
  playerPause,
  setIsMuted
};

/* Reducer */
const initialState = {
  overMode: PLAYER_OVER_MODES.firstTime,
  ready: false,
  metadataReady: false,
  file: null,
  shareStartEnd: { start: null, end: null },
  isFullScreen: false,
  keyboardCoef: 1
};

const onRemove = draft => {
  draft.overMode = PLAYER_OVER_MODES.firstTime;
  draft.ready    = false;
  draft.played   = false;
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

  draft.metadataReady = false;
  draft.file          = payload;
};

const onPlay = (draft, payload) => {
  draft.played = payload.newstate === 'playing';
  draft.loaded = true;
  if (draft.overMode === PLAYER_OVER_MODES.firstTime)
    draft.overMode = PLAYER_OVER_MODES.active;
};

export const reducer = handleActions({
  [PLAYER_READY]: draft => draft.ready = true,
  [PLAYER_METADATA_READY]: (draft, payload) => {
    if (payload.type !== 'meta')
      draft.metadataReady = true;
    else if (payload.metadataType === 'media')
      draft.metadataReady = true;
  },
  [PLAYER_REMOVE]: onRemove,
  [DESTROY_PLUGIN]: onRemove,
  [PLAYER_SET_FILE]: onSetFile,

  [PLAYER_PLAY]: onPlay,
  [PLAYER_PAUSE]: draft => draft.played = false,
  [PLAYER_BUFFER]: draft => draft.loaded = false,
  [PLAYER_RATE]: (draft, payload) => draft.rate = payload.playbackRate,
  [PLAYER_RESIZE]: (draft, payload) => draft.width = payload.width,
  [PLAYER_TOGGLE_MUTE]: (draft, payload) => draft.isMuted = payload.mute,
  [SET_KEYBOARD_COEF]: (draft, payload) => draft.keyboardCoef = payload,

  [PLAYER_SET_OVER_MODE]: onSetMode,
  [PLAYER_SET_IS_FULLSCREEN]: (draft, payload) => draft.isFullScreen = payload,
  [PLAYER_SET_LOADED]: (draft, payload) => draft.loaded = payload,

  [SET_SHARE_START_END]: (draft, payload) => draft.shareStartEnd = payload,
  [SET_IS_MUTED]: (draft, payload) => draft.isMuted = payload,
}, initialState);

const isReady          = state => state.ready;
const isMetadataReady  = state => state.ready && state.metadataReady;
const isLoaded         = state => state.loaded;
const isPlay           = state => state.played;
const getFile          = state => state.file;
const getOverMode      = state => state.overMode;
const isFullScreen     = state => state.isFullScreen;
const getRate          = state => state.rate || 1;
const getShareStartEnd = state => state.shareStartEnd;
const getPlayerWidth   = state => state.width;
const isMuted          = state => state.isMuted;
const getKeyboardCoef  = state => state.keyboardCoef;

export const selectors = {
  isReady,
  isMetadataReady,
  isLoaded,
  isPlay,
  getFile,
  getOverMode,
  isFullScreen,
  getRate,
  getShareStartEnd,
  getPlayerWidth,
  isMuted,
  getKeyboardCoef
};

export const PLAYER_ACTIONS_BY_EVENT = {
  'ready': playerReady,
  'playlistItem': playerReady,
  'remove': playerRemove,
  'destroyPlugin': playerDestroyPlugin,
  'audioTracks': playerMetadataReady,
  'meta': playerMetadataReady,

  'buffer': playerBuffer,
  'play': playerPlay,
  'pause': playerPause,
  'complete': playerComplete,

  'playbackRateChanged': playerRate,
  'mute': playerToggleMute,
  'resize': playerResize,
};

import { createAction, handleActions } from 'redux-actions';
import { PLAYER_OVER_MODES } from '../../../../src/helpers/consts';
import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { buildPlaylist } from '@/lib/redux/slices/playlistSlice/thunks';
import { playlistSlice } from '@/lib/redux/slices/playlistSlice/playlistSlice';
/*

const PLAYER_READY          = 'Player/READY';
const PLAYER_METADATA_READY = 'Player/PLAYER_METADATA_READY';
const PLAYER_REMOVE         = 'Player/REMOVE';
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
  draft.overMode      = PLAYER_OVER_MODES.firstTime;
  draft.ready         = false;
  draft.played        = false;
  draft.loaded        = false;
  draft.metadataReady = false;
};

const onSetMode = (draft, { payload }) => void (draft.overMode = payload);

const onSetFile = (draft, { payload }) => {
  //fix preload bug
  if (draft.file?.id !== payload.id) {
    draft.played = false;
    draft.loaded = false;
  }

  draft.file = payload;
};

const onPlay = (draft, { payload }) => {
  draft.played = payload.newstate === 'playing';
  draft.loaded = true;
  if (draft.overMode === PLAYER_OVER_MODES.firstTime)
    draft.overMode = PLAYER_OVER_MODES.active;
};
//const playerComplete = createAction(PLAYER_COMPLETE);

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playerReady: draft => void (draft.ready = true),
    playerMetadataReady: draft => void (draft.metadataReady = true),
    playerRemove: onRemove,
    setFile: onSetFile,

    playerPlay: onPlay,
    playerPause: draft => void (draft.played = false),
    playerBuffer: draft => void (draft.loaded = false),
    playerRate: (draft, { payload }) => void (draft.rate = payload.playbackRate),
    playerResize: (draft, { payload }) => void (draft.width = payload.width),
    playerToggleMute: (draft, { payload }) => void (draft.isMuted = payload.mute),
    setKeyboardCoef: (draft, { payload }) => void (draft.keyboardCoef = payload),

    setOverMode: onSetMode,
    setFullScreen: (draft, { payload }) => void (draft.isFullScreen = payload),
    setLoaded: (draft, { payload }) => void (draft.loaded = payload),

    setShareStartEnd: (draft, { payload }) => void (draft.shareStartEnd = payload),
    setIsMuted: (draft, { payload }) => void (draft.isMuted = payload),
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload.player };
    });
  }
});

export const PLAYER_ACTIONS_BY_EVENT = {
  'ready': playerSlice.actions.playerReady,
  'playlistItem': playerSlice.actions.playerReady,
  'remove': playerSlice.actions.playerRemove,
  'destroyPlugin': playerSlice.actions.playerRemove,

  'initSafari': playerSlice.actions.playerReady,
  'bufferFull': playerSlice.actions.playerMetadataReady,

  'buffer': playerSlice.actions.playerBuffer,
  'play': playerSlice.actions.playerPlay,
  'pause': playerSlice.actions.playerPause,
  //'complete': playlistSlice.actions.playerComplete,

  'playbackRateChanged': playerSlice.actions.playerRate,
  'mute': playerSlice.actions.playerToggleMute,
  'resize': playerSlice.actions.playerResize,
};

const isReady          = ({ ready }) => ({ ready, loaded: true });
const isMetadataReady  = state => state.metadataReady && state.ready;
const isLoaded         = state => state.loaded;
const isPlay           = state => state.played;
const getFile          = state => state.file ?? false;
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
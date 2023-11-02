import { PLAYER_OVER_MODES } from '@/src/helpers/consts';
import { createSlice } from '@reduxjs/toolkit';
//import { HYDRATE } from 'next-redux-wrapper';

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
    /*builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload.player };
    });*/
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

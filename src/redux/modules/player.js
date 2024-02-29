import { PLAYER_OVER_MODES } from '../../helpers/consts';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  overMode     : PLAYER_OVER_MODES.firstTime,
  ready        : false,
  metadataReady: false,
  file         : null,
  shareStartEnd: { start: null, end: null },
  isFullScreen : false,
  keyboardCoef : 1
};

const playerSlice = createSlice({
  name: 'player',
  initialState,

  reducers: {
    playerReady        : state => void (state.ready = true),
    playerMetadataReady: state => void (state.metadataReady = true),
    playerRemove       : state => {
      state.overMode      = PLAYER_OVER_MODES.firstTime;
      state.ready         = false;
      state.played        = false;
      state.loaded        = false;
      state.metadataReady = false;
    },
    setFile            : (state, { payload }) => {
      //fix preload bug
      if (state.file?.id !== payload.id) {
        state.played = false;
        state.loaded = false;
      }

      state.file = payload;
    },

    playerPlay      : (state, { payload }) => {
      state.played = payload.newstate === 'playing';
      state.loaded = true;
      if (state.overMode === PLAYER_OVER_MODES.firstTime)
        state.overMode = PLAYER_OVER_MODES.active;
    },
    playerBuffer    : state => void (state.loaded = false),
    playerPause     : state => void (state.played = false),
    playerRate      : (state, { payload }) => void (state.rate = payload.playbackRate),
    playerResize    : (state, { payload }) => void (state.width = payload.width),
    playerToggleMute: (state, { payload }) => void (state.isMuted = payload.mute),
    playerComplete  : () => void ({}),

    setOverMode    : (state, { payload }) => void (state.overMode = payload),
    setFullscreen  : (state, { payload }) => void (state.isFullScreen = payload),
    setLoaded      : (state, { payload }) => void (state.loaded = payload),
    setKeyboardCoef: (state, { payload }) => void (state.keyboardCoef = payload),

    setShareStartEnd: (state, { payload }) => void (state.shareStartEnd = payload),
    setIsMuted      : (state, { payload }) => void (state.isMuted = payload)
  },

  selectors: {
    isReady         : state => state.ready,
    isMetadataReady : state => state.metadataReady && state.ready,
    isLoaded        : state => state.loaded,
    isPlay          : state => state.played,
    getFile         : state => state.file,
    getOverMode     : state => state.overMode,
    isFullScreen    : state => state.isFullScreen,
    getRate         : state => state.rate || 1,
    getShareStartEnd: state => state.shareStartEnd,
    getPlayerWidth  : state => state.width,
    isMuted         : state => state.isMuted,
    getKeyboardCoef : state => state.keyboardCoef
  }
});

export default playerSlice.reducer;

export const { actions } = playerSlice;

export const types = Object.fromEntries(new Map(
  Object.values(playerSlice.actions).map(a => [a.type, a.type])
));

export const selectors = playerSlice.getSelectors();

export const PLAYER_ACTIONS_BY_EVENT = {
  'ready'        : playerSlice.actions.playerReady,
  'playlistItem' : playerSlice.actions.playerReady,
  'remove'       : playerSlice.actions.playerRemove,
  'destroyPlugin': playerSlice.actions.playerRemove,

  'initSafari': playerSlice.actions.playerReady,
  'bufferFull': playerSlice.actions.playerMetadataReady,

  'buffer'  : playerSlice.actions.playerBuffer,
  'play'    : playerSlice.actions.playerPlay,
  'pause'   : playerSlice.actions.playerPause,
  'complete': playerSlice.actions.playerComplete,

  'playbackRateChanged': playerSlice.actions.playerRate,
  'mute'               : playerSlice.actions.playerToggleMute,
  'resize'             : playerSlice.actions.playerResize
};

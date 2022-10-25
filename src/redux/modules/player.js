import { createAction } from 'redux-actions';
import { handleActions } from './settings';
import { JWPLAYER_ID, PLAYER_OVER_MODES } from '../../helpers/consts';

const PLAYER_READY          = 'Player/READY';
const PLAYER_REMOVE         = 'Player/REMOVE';
const PLAYER_PLAY           = 'Player/PLAY';
const PLAYER_PAUSE          = 'Player/PAUSE';
const PLAYER_RATE           = 'Player/RATE';
const PLAYER_RESIZE         = 'Player/RESIZE';
const PLAYER_MUTE_UNMUTE    = 'Player/MUTE_UNMUTE';
const PLAYER_DESTROY_PLUGIN = 'Player/DESTROY_PLUGIN';

const PLAYER_SET_FILE           = 'Player/SET_FILE';
const PLAYER_SET_OVER_MODE      = 'Player/SET_OVER_MODE';
const PLAYER_CONTINUE_PLAY_FROM = 'Player/CONTINUE_PLAY_FROM';
const PLAYER_NEW_PLAYLIST_ITEM  = 'Player/NEW_PLAYLIST_ITEM';

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

const setOverMode     = createAction(PLAYER_SET_OVER_MODE);
const continuePlay    = createAction(PLAYER_CONTINUE_PLAY_FROM);
const newPlaylistItem = createAction(PLAYER_NEW_PLAYLIST_ITEM);

const setShareStartEnd = createAction(SET_SHARE_START_END);

export const actions = {
  setFile,
  setOverMode,
  setShareStartEnd,

  playerPlay,
  playerPause,
  continuePlay,
};

/* Reducer */
const initialState = {
  overMode: null,
  continuePlay: { pos: -1, isPlayed: false },
  isReady: false,
  file: null,
  shareStartEnd: { start: 0, end: Infinity },
};

const onRemove = draft => {
  draft.continuePlay = initialState.continuePlay;
  draft.overMode     = null;
  draft.ready        = false;
};

const onNewPlaylistItem = (draft, e) => {
  const p = window.jwplayer(JWPLAYER_ID);
  if (draft.continuePlay && draft.continuePlay.pos !== -1) {
    p.stop().seek(draft.continuePlay.pos);
    draft.continuePlay.isPlayed ? p.play() : p.pause();

    draft.continuePlay = { pos: -1, isPlayed: false };
    draft.overMode     = null;
  }
};

const onContinuePlay = (draft, payload = -1) => {
  const p            = window.jwplayer(JWPLAYER_ID);
  const pos          = p.getPosition();
  const isPlayed     = p.getState() === 'playing';
  draft.continuePlay = { pos, isPlayed };
};

export const reducer = handleActions({
  [PLAYER_READY]: draft => draft.ready = true,
  [PLAYER_REMOVE]: onRemove,
  [PLAYER_SET_FILE]: (draft, payload) => draft.file = payload,

  [PLAYER_PLAY]: (draft, payload) => draft.played = payload.newstate === 'playing',
  [PLAYER_PAUSE]: draft => draft.played = false,
  [PLAYER_RATE]: (draft, payload) => draft.rate = payload.playbackRate,
  [PLAYER_RESIZE]: (draft, payload) => draft.width = payload.width,
  [PLAYER_MUTE_UNMUTE]: (draft, payload) => draft.muteUnmute = payload,

  [PLAYER_SET_OVER_MODE]: (draft, payload) => draft.overMode = payload,
  [PLAYER_CONTINUE_PLAY_FROM]: onContinuePlay,
  [PLAYER_NEW_PLAYLIST_ITEM]: onNewPlaylistItem,

  [SET_SHARE_START_END]: (draft, payload) => draft.shareStartEnd = payload
}, initialState);

const isReady          = state => state.ready;
const isPlay           = state => state.played;
const getFile          = state => state.file;
const getOverMode      = state => state.overMode || PLAYER_OVER_MODES.none;
const getRate          = state => state.rate || 1;
const getShareStartEnd = state => state.shareStartEnd;
const getPlayerWidth   = state => state.width;

export const selectors = {
  isReady,
  isPlay,
  getFile,
  getOverMode,
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
  'playlistItem': newPlaylistItem,
  'resize': playerResize,
  'mute': playerMuteUnmute,
  'destroyPlugin': playerDestroyPlugin,
};

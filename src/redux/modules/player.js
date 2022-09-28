import { createAction } from 'redux-actions';
import { handleActions } from './settings';
import { JWPLAYER_ID, PLAYER_OVER_MODES } from '../../helpers/consts';

const PLAYER_READY  = 'Player/READY';
const PLAYER_REMOVE = 'Player/REMOVE';
const PLAYER_PLAY   = 'Player/PLAY';
const PLAYER_PAUSE  = 'Player/PAUSE';
const PLAYER_RATE   = 'Player/RATE';

const PLAYER_SET_FILE           = 'Player/SET_FILE';
const PLAYER_SET_OVER_MODE      = 'Player/SET_OVER_MODE';
const PLAYER_CONTINUE_PLAY_FROM = 'Player/CONTINUE_PLAY_FROM';
const PLAYER_NEW_PLAYLIST_ITEM  = 'Player/NEW_PLAYLIST_ITEM';

const SET_SHARE_START_END = 'Player/SET_SHARE_START_END';

export const types = {
  PLAYER_READY,
  PLAYER_PLAY
};

// Actions
const playerReady  = createAction(PLAYER_READY);
const playerRemove = createAction(PLAYER_REMOVE);
const setFile      = createAction(PLAYER_SET_FILE);

const playerPlay  = createAction(PLAYER_PLAY);
const playerPause = createAction(PLAYER_PAUSE);
const playerRate  = createAction(PLAYER_RATE);

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

const onReady = draft => draft.ready = true;

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
  } else {
    p.play().pause();
  }
};
const onSetFile         = (draft, payload) => draft.file = payload;

const onPlay = (draft, payload) => draft.played = payload;

const onPause = draft => draft.played = false;

const onRate = (draft, payload) => draft.rate = payload.playbackRate;

const onSetOverMode = (draft, payload) => draft.overMode = payload;

const onContinuePlay = (draft, payload = -1) => {
  const p            = window.jwplayer(JWPLAYER_ID);
  const pos          = p.getPosition();
  const isPlayed     = p.getState() === 'playing';
  draft.continuePlay = { pos, isPlayed };
};

export const reducer = handleActions({
  [PLAYER_READY]: onReady,
  [PLAYER_REMOVE]: onRemove,
  [PLAYER_SET_FILE]: onSetFile,

  [PLAYER_PLAY]: onPlay,
  [PLAYER_PAUSE]: onPause,
  [PLAYER_RATE]: onRate,

  [PLAYER_SET_OVER_MODE]: onSetOverMode,
  [PLAYER_CONTINUE_PLAY_FROM]: onContinuePlay,
  [PLAYER_NEW_PLAYLIST_ITEM]: onNewPlaylistItem,

  [SET_SHARE_START_END]: (draft, payload) => {
    draft.shareStartEnd = payload;
  },
}, initialState);

const isReady          = state => state.ready;
const isPlay           = state => state.played;
const getFile          = state => state.file;
const getOverMode      = state => state.overMode || PLAYER_OVER_MODES.none;
const getRate          = state => state.rate || 1;
const getShareStartEnd = state => state.shareStartEnd;

export const selectors = {
  isReady,
  isPlay,
  getFile,
  getOverMode,
  getRate,
  getShareStartEnd,
};

export const PLAYER_ACTIONS_BY_EVENT = {
  'ready': playerReady,
  'remove': playerRemove,
  'play': playerPlay,
  'playbackRateChanged': playerRate,
  'pause': playerPause,
  'playlistItem': newPlaylistItem,
};

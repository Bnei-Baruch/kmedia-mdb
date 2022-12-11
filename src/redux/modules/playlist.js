import { createAction } from 'redux-actions';
import { handleActions } from './settings';
import { DEFAULT_LANGUAGE, VS_DEFAULT } from '../../helpers/consts';
import { saveTimeOnLocalstorage } from '../../components/Player/Controls/helper';

const PLAYLIST_BUILD         = 'Playlist/BUILD';
const PLAYLIST_BUILD_SUCCESS = 'Playlist/BUILD_SUCCESS';
const SINGLE_MEDIA_BUILD     = 'Playlist/SINGLE_MEDIA_BUILD';
const MY_PLAYLIST_BUILD      = 'Playlist/MY_PLAYLIST_BUILD';

const PLAYLIST_SELECT       = 'Playlist/SELECT';
const PLAYLIST_NEXT         = 'Playlist/NEXT';
const PLAYLIST_PREV         = 'Playlist/PREV';
const PLAYER_SET_QUALITY    = 'Player/SET_QUALITY';
const PLAYER_SET_LANGUAGE   = 'Player/SET_LANGUAGE';
const PLAYER_SET_MEDIA_TYPE = 'Player/SET_MEDIA_TYPE';

export const types = {
  PLAYLIST_BUILD,
  SINGLE_MEDIA_BUILD,
  MY_PLAYLIST_BUILD
};

// Actions
const build            = createAction(PLAYLIST_BUILD, (cId, cuId) => ({ cId, cuId }));
const buildSuccess     = createAction(PLAYLIST_BUILD_SUCCESS);
const singleMediaBuild = createAction(SINGLE_MEDIA_BUILD);
const myPlaylistBuild  = createAction(MY_PLAYLIST_BUILD, pId => ({ pId }));

const select       = createAction(PLAYLIST_SELECT);
const next         = createAction(PLAYLIST_NEXT);
const prev         = createAction(PLAYLIST_PREV);
const setQuality   = createAction(PLAYER_SET_QUALITY);
const setLanguage  = createAction(PLAYER_SET_LANGUAGE);
const setMediaType = createAction(PLAYER_SET_MEDIA_TYPE);

export const actions = {
  build,
  singleMediaBuild,
  myPlaylistBuild,
  buildSuccess,

  select,
  next,
  prev,
  setQuality,
  setLanguage,
  setMediaType,
};

/* Reducer */
const initialState = {
  playlist: [],
  itemById: {},
  info: {},
  isReady: false
};

const onBuild = draft => {
  draft.info = { isReady: false, wip: true };
};

const onBuildSuccess = (draft, payload) => {
  const { cuId, items, ...info } = payload;

  let language = draft.info.language || payload.language || DEFAULT_LANGUAGE;

  draft.playlist = items.map(({ id }) => id);
  draft.itemById = items.reduce((acc, x) => ({ ...acc, [x.id]: x }), {});
  if (draft.itemById[cuId] && !draft.itemById[cuId].qualityByLang[language]) {
    language = draft.itemById[cuId].languages[0];
  }
  const quality = draft.info.quality || draft.itemById[cuId]?.qualityByLang[language]?.[0] || VS_DEFAULT;
  draft.info    = { ...info, cuId, language, quality, isReady: true, wip: false };
};

const onNext = (draft, restart = false) => {
  const idx     = draft.playlist.findIndex(x => x === draft.info.cuId);
  const lastIdx = draft.playlist.length - 1;
  const nextId  = draft.playlist[(idx < lastIdx) ? idx + 1 : lastIdx];
  if (restart) saveTimeOnLocalstorage(0, nextId);
  draft.info.cuId = nextId;
};

const onPrev = draft => {
  const idx       = draft.playlist.findIndex(x => x === draft.info.cuId);
  draft.info.cuId = draft.playlist[idx > 1 ? idx - 1 : 0];
};

export const reducer = handleActions({
  [PLAYLIST_BUILD]: onBuild,
  [SINGLE_MEDIA_BUILD]: onBuild,
  [MY_PLAYLIST_BUILD]: onBuild,
  [PLAYLIST_BUILD_SUCCESS]: onBuildSuccess,

  [PLAYLIST_NEXT]: onNext,
  [PLAYLIST_PREV]: onPrev,
  [PLAYLIST_SELECT]: (draft, payload) => draft.info.cuId = payload,

  [PLAYER_SET_QUALITY]: (draft, payload) => draft.info.quality = payload,
  [PLAYER_SET_LANGUAGE]: (draft, payload) => draft.info.language = payload,
  [PLAYER_SET_MEDIA_TYPE]: (draft, payload) => draft.info.mediaType = payload,
}, initialState);

const getPlaylist = state => state.playlist;
const getPlayed   = state => state.itemById[state.info.cuId] || false;

const getInfo = state => {
  return state.info;
};

const getNextId = state => {
  const curIdx = state.playlist.findIndex(x => x === state.info.cuId);
  if (state.playlist.length <= curIdx) return false;
  const idx = curIdx + 1;
  return state.playlist[idx];
};

const getPrevId = state => {
  const curIdx = state.playlist.findIndex(x => x === state.info.cuId);
  if (1 > curIdx) return false;
  const idx = curIdx - 1;
  return state.playlist[idx];
};

const getIndexById = (state, id) => state.playlist.findIndex(x => x === id);

export const selectors = {
  getPlaylist,
  getPlayed,
  getInfo,
  getNextId,
  getPrevId,
  getIndexById
};

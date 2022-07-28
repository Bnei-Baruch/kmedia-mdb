import { createAction } from 'redux-actions';
import { handleActions } from './settings';
import { DEFAULT_LANGUAGE, MT_VIDEO } from '../../helpers/consts';

const PLAYLIST_BUILD         = 'Playlist/BUILD';
const PLAYLIST_BUILD_SUCCESS = 'Playlist/BUILD_SUCCESS';
const PLAYLIST_SELECT        = 'Playlist/SELECT';
const PLAYLIST_NEXT          = 'Playlist/NEXT';
const PLAYLIST_PREV          = 'Playlist/PREV';
const PLAYER_SET_QUALITY     = 'Player/SET_QUALITY';
const PLAYER_SET_LANGUAGE    = 'Player/SET_LANGUAGE';

export const types = {
  PLAYLIST_BUILD,
  PLAYLIST_BUILD_SUCCESS,
  PLAYLIST_SELECT,
  PLAYLIST_NEXT,
  PLAYLIST_PREV,
};

// Actions
const build        = createAction(PLAYLIST_BUILD, (cId, cuId) => ({ cId, cuId }));
const buildSuccess = createAction(PLAYLIST_BUILD_SUCCESS);
const select       = createAction(PLAYLIST_SELECT);
const next         = createAction(PLAYLIST_NEXT);
const prev         = createAction(PLAYLIST_PREV);
const setQuality   = createAction(PLAYER_SET_QUALITY);
const setLanguage  = createAction(PLAYER_SET_LANGUAGE);

export const actions = {
  build,
  buildSuccess,
  select,
  next,
  prev,
  setQuality,
  setLanguage,
};

/* Reducer */
const initialState = {
  playlist: [],
  itemById: {},
  info: {
    language: DEFAULT_LANGUAGE,
    mediaType: MT_VIDEO
  }
};

const onBuildSuccess = (draft, payload) => {
  const {
    cId,
    cuId,
    language,
    items,
    name
  } = payload;

  draft.playlist  = items.map(({ id }) => id);
  draft.itemById  = items.reduce((acc, x) => ({ ...acc, [x.id]: x }), {});
  const quality   = draft.info.quality || draft.itemById[cuId].qualityByLang[0];
  const mediaType = draft.info.quality || draft.itemById[cuId].mtByLang[0];

  draft.info = { played: cuId, cId, name, language, quality, mediaType, };
};

const onSelect = (draft, payload) => {
  draft.info.played = payload;
};

const onNext = draft => {
  const idx         = draft.playlist.findIndex(x => x === draft.info.played);
  const lastIdx     = draft.playlist.length - 1;
  draft.info.played = draft.playlist[(idx < lastIdx) ? idx + 1 : lastIdx];
};

const onPrev = draft => {
  const idx         = draft.playlist.findIndex(x => x === draft.info.played);
  draft.info.played = draft.playlist[idx > 1 ? idx - 1 : 0];
};

const onSetQuality = (draft, payload) => draft.info.quality = payload;

const onSetLanguage = (draft, payload) => draft.info.language = payload;

export const reducer = handleActions({
  [PLAYLIST_BUILD_SUCCESS]: onBuildSuccess,
  [PLAYLIST_SELECT]: onSelect,
  [PLAYLIST_NEXT]: onNext,
  [PLAYLIST_PREV]: onPrev,
  [PLAYER_SET_QUALITY]: onSetQuality,
  [PLAYER_SET_LANGUAGE]: onSetLanguage,
}, initialState);

const getPlaylist = state => state.playlist;
const getPlayed   = state => state.itemById[state.info.played] || false;

const getInfo     = state => state.info;

export const selectors = {
  getPlaylist,
  getPlayed,
  getInfo,

};

import { createAction } from 'redux-actions';
import { handleActions, types as settings, types as settingsTypes } from './settings';
import { DEFAULT_LANGUAGE, VS_DEFAULT } from '../../helpers/consts';
import { types as playerTypes } from './player';
import { saveTimeOnLocalstorage } from '../../components/Player/Controls/helper';
import { getQualitiesFromLS } from '../../pkg/jwpAdapter/adapter';

const PLAYLIST_BUILD         = 'Playlist/BUILD';
const PLAYLIST_BUILD_SUCCESS = 'Playlist/BUILD_SUCCESS';
const SINGLE_MEDIA_BUILD     = 'Playlist/SINGLE_MEDIA_BUILD';
const MY_PLAYLIST_BUILD      = 'Playlist/MY_PLAYLIST_BUILD';

const PLAYLIST_SELECT       = 'Playlist/SELECT';
const PLAYER_SET_QUALITY    = 'Player/SET_QUALITY';
const PLAYER_SET_LANGUAGE   = 'Player/SET_LANGUAGE';
const PLAYER_SET_MEDIA_TYPE = 'Player/SET_MEDIA_TYPE';
const PLAYER_NULL_NEXT_UNIT = 'Player/NULL_NEXT_UNIT';

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
const setQuality   = createAction(PLAYER_SET_QUALITY);
const setLanguage  = createAction(PLAYER_SET_LANGUAGE);
const setMediaType = createAction(PLAYER_SET_MEDIA_TYPE);
const nullNextUnit = createAction(PLAYER_NULL_NEXT_UNIT);

export const actions = {
  build,
  singleMediaBuild,
  myPlaylistBuild,
  buildSuccess,

  select,
  setQuality,
  setLanguage,
  setMediaType,
  nullNextUnit
};

/* Reducer */
const initialState = {
  playlist: [],
  itemById: {},
  info: {}
};

const onBuild = draft => {
  draft.info = { isReady: false, wip: true };
};

const onBuildSuccess = (draft, payload) => {
  const { cuId, id: _id, items, ...info } = payload;

  const id     = _id || cuId;
  let language = draft.info.language || payload.language || DEFAULT_LANGUAGE;

  draft.playlist = items.map(({ id }) => id);
  //use curId - fix for my playlists
  draft.itemById = items.reduce((acc, x) => ({ ...acc, [x.id]: x }), {});
  const curItem  = draft.itemById?.[id];
  if (curItem && !curItem.isHLS && !curItem.qualityByLang[language]) {
    language = curItem.languages[0];
  }

  let quality     = draft.info.quality;
  const qualities = curItem.isHLS ? curItem.qualities : curItem?.qualityByLang?.[language];
  if (!quality && qualities) {
    const idx = qualities.findIndex(x => {
      const y = getQualitiesFromLS();
      return x === y;
    });
    quality   = qualities[idx];
  }
  if (!quality) quality = VS_DEFAULT;

  draft.info = { ...info, cuId, id, language, quality, isReady: true, wip: false };
};

const onRemovePlayer = draft => {
  draft.info = { isReady: false };
};

const onComplete = draft => {
  const idx     = draft.playlist.findIndex(x => x === draft.info.id);
  const lastIdx = draft.playlist.length - 1;
  if (idx === lastIdx) return;
  const nextId = draft.playlist[(idx < lastIdx) ? idx + 1 : lastIdx];
  saveTimeOnLocalstorage(1, nextId);
  draft.info.nextUnitId = nextId;
};

const onUpdateMediaType = (draft, payload) => {
  draft.info.mediaType = payload;

  const item = draft.itemById[draft.info.id] || false;
  if (item.isHLS) {
    draft.itemById[draft.info.id].id = `${item?.file.id}_${draft.info.mediaType}`;
  }
};

export const reducer = handleActions({
  [PLAYLIST_BUILD]: onBuild,
  [SINGLE_MEDIA_BUILD]: onBuild,
  [MY_PLAYLIST_BUILD]: onBuild,
  [PLAYLIST_BUILD_SUCCESS]: onBuildSuccess,

  [PLAYLIST_SELECT]: (draft, payload) => draft.info = { ...draft.info, ...payload },

  [PLAYER_SET_QUALITY]: (draft, payload) => draft.info.quality = payload,
  [PLAYER_SET_LANGUAGE]: (draft, payload) => draft.info.language = payload,
  [PLAYER_SET_MEDIA_TYPE]: onUpdateMediaType,
  [PLAYER_NULL_NEXT_UNIT]: (draft, payload = null) => draft.info.nextUnitId = payload,
  [playerTypes.PLAYER_COMPLETE]: onComplete,

  [settings.SET_LANGUAGE]: onRemovePlayer,
  [settingsTypes.SET_CONTENT_LANGUAGE]: (draft, payload) => draft.info.language = payload,
}, initialState);

const getPlaylist  = state => state.playlist;
const getPlayed    = state => state.itemById[state.info.id] || false;
const getInfo      = state => state.info;
const getNextId    = state => {
  const curIdx = state.playlist.findIndex(x => x === state.info.id);
  if (state.playlist.length <= curIdx) return false;
  const idx = curIdx + 1;
  return state.playlist[idx];
};
const getPrevId    = state => {
  const curIdx = state.playlist.findIndex(x => x === state.info.id);
  if (1 > curIdx) return false;
  const idx = curIdx - 1;
  return state.playlist[idx];
};
const getIndexById = (state, id) => state.playlist.findIndex(x => x === id);
const getItemById  = state => id => {
  return state.itemById[id];
};

export const selectors = {
  getPlaylist,
  getPlayed,
  getInfo,
  getNextId,
  getPrevId,
  getIndexById,
  getItemById
};

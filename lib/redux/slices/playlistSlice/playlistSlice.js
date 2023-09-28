import { createAction, handleActions } from 'redux-actions';
import { DEFAULT_CONTENT_LANGUAGE, VS_DEFAULT } from '../../../../src/helpers/consts';
import { types as playerTypes, playerSlice, PLAYER_READY } from '../playerSlice/playerSlice';
import { saveTimeOnLocalstorage } from '@/lib/Player/Controls/helper';
import { getQualitiesFromLS } from '@/pkg/jwpAdapter/adapter';
import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { fetchPreparePage } from '@/lib/redux/slices/preparePageSlice/thunks';
import { buildPlaylist } from '@/lib/redux/slices/playlistSlice/thunks';
import { restorePreferredMediaType } from '@/lib/redux/slices/playlistSlice/helper';

export const SHOWED_PLAYLIST_ITEMS = 7;

const PLAYLIST_BUILD         = 'Playlist/BUILD';
const PLAYLIST_BUILD_SUCCESS = 'Playlist/BUILD_SUCCESS';
const SINGLE_MEDIA_BUILD     = 'Playlist/SINGLE_MEDIA_BUILD';
const MY_PLAYLIST_BUILD      = 'Playlist/MY_PLAYLIST_BUILD';

const PLAYLIST_SELECT          = 'Playlist/SELECT';
const PLAYER_SET_QUALITY       = 'Player/SET_QUALITY';
const PLAYER_SET_LANGUAGE      = 'Player/SET_LANGUAGE';
const PLAYER_SET_MEDIA_TYPE    = 'Player/SET_MEDIA_TYPE';
const PLAYER_SET_SUBS_LANGUAGE = 'Player/SET_SUBS_LANGUAGE';
const PLAYER_NULL_NEXT_UNIT    = 'Player/NULL_NEXT_UNIT';
const SHOW_IMAGES              = 'Player/SHOW_IMAGES';
const FETCH_SHOW_DATA          = 'Player/FETCH_SHOW_DATA';
const FETCH_SHOW_DATA_SUCCESS  = 'Player/FETCH_SHOW_DATA_SUCCESS';

export const types = {
  PLAYLIST_BUILD,
  SINGLE_MEDIA_BUILD,
  MY_PLAYLIST_BUILD,
  FETCH_SHOW_DATA
};

// Actions
const build            = createAction(PLAYLIST_BUILD, (cId, cuId) => ({ cId, cuId }));
const buildSuccess     = createAction(PLAYLIST_BUILD_SUCCESS);
const singleMediaBuild = createAction(SINGLE_MEDIA_BUILD);
const myPlaylistBuild  = createAction(MY_PLAYLIST_BUILD, pId => ({ pId }));

const select               = createAction(PLAYLIST_SELECT);
const setQuality           = createAction(PLAYER_SET_QUALITY);
const setLanguage          = createAction(PLAYER_SET_LANGUAGE);
const setSubsLanguage      = createAction(PLAYER_SET_SUBS_LANGUAGE);
const setMediaType         = createAction(PLAYER_SET_MEDIA_TYPE);
const nullNextUnit         = createAction(PLAYER_NULL_NEXT_UNIT);
const showImages           = createAction(SHOW_IMAGES);
const fetchShowData        = createAction(FETCH_SHOW_DATA);
const fetchShowDataSuccess = createAction(FETCH_SHOW_DATA_SUCCESS);

export const actions = {
  build,
  singleMediaBuild,
  myPlaylistBuild,
  buildSuccess,

  select,
  setQuality,
  setLanguage,
  setSubsLanguage,
  setMediaType,
  nullNextUnit,
  showImages,
  fetchShowData,
  fetchShowDataSuccess
};

/* Reducer */
const initialState = {
  playlist: [],
  itemById: {},
  info: {},
  fetched: {}
};

const onBuild = draft => {
  draft.info = { isReady: false, wip: true };
};

const onBuildSuccess = (draft, { payload }) => {
  const { cuId, id: _id, items, fetched = {}, ...info } = payload;

  const id     = _id || cuId;
  let language = draft.info.language || payload.language || DEFAULT_CONTENT_LANGUAGE;

  //use curId - fix for my playlists
  draft.itemById = items.reduce((acc, x, ap) => ({ ...acc, [x.id]: x, ap }), {});
  const curItem  = draft.itemById?.[id];
  if (curItem && !curItem.isHLS && (curItem.languages && !curItem.languages.includes(language))) {
    language = curItem.languages[0];
  }

  let quality     = draft.info.quality ?? null;
  const qualities = curItem?.isHLS ? curItem.qualities : curItem?.qualityByLang?.[language] || [];
  const playlist  = items.map(({ id }) => ({ id }));
  const selIndex  = playlist.findIndex(x => x.id === (cuId || id));
  draft.playlist  = playlist.map((x, i) => {
    const showImg = i > selIndex - 2 && i < selIndex + SHOWED_PLAYLIST_ITEMS;
    const f       = i >= fetched.from && i <= fetched.to;
    return { ...x, showImg, fetched: f };
  });
  draft.info      = { ...info, cuId, id, language, subsLanguage: language, qualities, quality };
  draft.fetched   = fetched;
};

const onRemovePlayer = draft => {
  draft.info = { isReady: false };
};

const onComplete = draft => {
  const idx     = draft.playlist.findIndex(x => x.id === draft.info.id);
  const lastIdx = draft.playlist.length - 1;
  if (idx === lastIdx) return;
  const nextId = draft.playlist[(idx < lastIdx) ? idx + 1 : lastIdx]?.id;
  saveTimeOnLocalstorage(1, nextId);
  draft.info.nextUnitId = nextId;
};

const onUpdateMediaType      = (draft, payload) => {
  draft.info.mediaType = payload;

  const item = draft.itemById[draft.info.id] || false;
  if (item.isHLS) {
    draft.itemById[draft.info.id].id = `${item?.file.id}_${draft.info.mediaType}`;
  }
};
const onShowImages           = (draft, idx) => {
  draft.playlist.forEach((x, i) => {
    if (x.showImg) return;
    x.showImg = i > idx - 2 && i < idx + SHOWED_PLAYLIST_ITEMS;
  });
};
const onFetchShowDataSuccess = (draft, action) => {
  const { items, fetched } = action.payload;
  items.forEach(x => {
    draft.itemById[x.id] = x;
  });
  draft.fetched = fetched;
  draft.playlist.forEach((x, i) => {
    if (i > fetched.from && i < fetched.to)
      x.fetched = true;
  });
};

const hydrateLocalstorage = state => {
  if (!state.info.mediaType)
    state.info.mediaType = restorePreferredMediaType();
  let quality = !state.info.quality;
  if (!quality && state.info.qualities) {
    const idx = state.info.qualities.findIndex(x => {
      const y = getQualitiesFromLS();
      return x === y;
    });
    quality   = state.info.qualities[idx];
  }
  if (!quality) quality = VS_DEFAULT;
  state.info.quality = quality;
};

/*
export const reducer         = handleActions({
  [PLAYLIST_BUILD]: onBuild,
  [SINGLE_MEDIA_BUILD]: onBuild,
  [MY_PLAYLIST_BUILD]: onBuild,
  [PLAYLIST_BUILD_SUCCESS]: onBuildSuccess,

  [PLAYLIST_SELECT]:,

  [PLAYER_SET_QUALITY]:,
  [PLAYER_SET_LANGUAGE]:,
  [PLAYER_SET_SUBS_LANGUAGE]:,
  [PLAYER_SET_MEDIA_TYPE]:,
  [PLAYER_NULL_NEXT_UNIT]:,
  [playerTypes.PLAYER_COMPLETE]: onComplete,
  [SHOW_IMAGES]: onShowImages,
  [FETCH_SHOW_DATA_SUCCESS]: onFetchShowDataSuccess,

  //[settings.SET_CONTENT_LANGUAGES]: onRemovePlayer,
  //[settingsTypes.SET_CONTENT_LANGUAGE]: (draft, payload) => draft.info.language = payload,
}, initialState);
*/
export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    select: (draft, payload) => draft.info = { ...draft.info, ...payload },
    setQuality: (draft, payload) => draft.info.quality = payload,
    setLanguage: (draft, payload) => draft.info.language = payload,
    setSubsLanguage: (draft, payload) => draft.info.subsLanguage = payload,
    setMediaType: onUpdateMediaType,
    hydrateLocalstorage,
    nullNextUnit: (draft, payload = null) => draft.info.nextUnitId = payload,
    fetchShowDataSuccess: onFetchShowDataSuccess
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload.playlist };
    });

    builder.addCase(playerSlice.actions.playerReady.type, state => {
      state.info.isReady = true;
    });
    builder.addCase(buildPlaylist.fulfilled, onBuildSuccess);
  }
});

const getPlaylist  = state => state.playlist;
const getPlayed    = state => state.itemById[state.info.id] || false;
const getInfo      = state => state.info;
const getNextId    = state => {
  const curIdx = state.playlist.findIndex(x => x.id === state.info.id);
  if (state.playlist.length <= curIdx) return false;
  const idx = curIdx + 1;
  return state.playlist[idx]?.id;
};
const getPrevId    = state => {
  const curIdx = state.playlist.findIndex(x => x.id === state.info.id);
  if (1 > curIdx) return false;
  const idx = curIdx - 1;
  return state.playlist[idx]?.id;
};
const getIndexById = (state, id) => state.playlist.findIndex(x => x.id === id);
const getItemById  = state => id => {
  return state.itemById[id] || false;
};
const getFetched   = state => state.fetched;

export const selectors = {
  getPlaylist,
  getPlayed,
  getInfo,
  getNextId,
  getPrevId,
  getIndexById,
  getItemById,
  getFetched
};

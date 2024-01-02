import { createSlice } from '@reduxjs/toolkit';
import { actions as settingsActions } from './settings';
import { actions as playerActions } from './player';

import { DEFAULT_CONTENT_LANGUAGE, VS_DEFAULT } from '../../helpers/consts';
import { saveTimeOnLocalstorage } from '../../components/Player/Controls/helper';
import { getQualitiesFromLS } from '../../pkg/jwpAdapter/adapter';

export const SHOWED_PLAYLIST_ITEMS = 7;

const onBuildSuccess = (state, payload) => {
  const { cuId, id: _id, items, fetched = {}, ...info } = payload;

  const id     = _id || cuId;
  let language = state.info.language || payload.language || DEFAULT_CONTENT_LANGUAGE;

  //use curId - fix for my playlists
  state.itemById = items.reduce((acc, x, ap) => ({ ...acc, [x.id]: x, ap }), {});
  const curItem  = state.itemById?.[id];
  if (curItem && !curItem.isHLS && (curItem.languages && !curItem.languages.includes(language))) {
    language = curItem.languages[0];
  }

  let { quality } = state.info;
  const qualities = curItem?.isHLS ? curItem.qualities : curItem?.qualityByLang?.[language] || [];
  if (!quality && qualities) {
    const idx = qualities.findIndex(x => {
      const y = getQualitiesFromLS();
      return x === y;
    });
    quality   = qualities[idx];
  }

  if (!quality) quality = VS_DEFAULT;
  const playlist  = items.map(({ id }) => ({ id }));
  const selIndex  = playlist.findIndex(x => x.id === (cuId || id));
  state.playlist  = playlist.map((x, i) => {
    const showImg = i > selIndex - 2 && i < selIndex + SHOWED_PLAYLIST_ITEMS;
    const f       = i >= fetched.from && i <= fetched.to;
    return { ...x, showImg, fetched: f };
  });
  state.info      = { ...info, cuId, id, language, subsLanguage: language, quality, isReady: true, wip: false };
  state.fetched   = fetched;
};

const onComplete = state => {
  const idx     = state.playlist.findIndex(x => x.id === state.info.id);
  const lastIdx = state.playlist.length - 1;
  if (idx === lastIdx) return;
  const nextId = state.playlist[(idx < lastIdx) ? idx + 1 : lastIdx]?.id;
  saveTimeOnLocalstorage(1, nextId);
  state.info.nextUnitId = nextId;
};

const onUpdateMediaType = (state, payload) => {
  state.info.mediaType = payload;

  const item = state.itemById[state.info.id] || false;
  if (item.isHLS) {
    state.itemById[state.info.id].id = `${item?.file.id}_${state.info.mediaType}`;
  }
};

const onShowImages = (state, idx) => {
  state.playlist.forEach((x, i) => {
    if (x.showImg) return;
    x.showImg = i > idx - 2 && i < idx + SHOWED_PLAYLIST_ITEMS;
  });
};

const onFetchShowDataSuccess = (state, { items, fetched }) => {
  items.forEach(x => {
    state.itemById[x.id] = x;
  });
  state.fetched = fetched;
  state.playlist.forEach((x, i) => {
    if (i > fetched.from && i < fetched.to)
      x.fetched = true;
  });
};

const playlistSlice = createSlice(
  {
    name        : 'playlist',
    initialState: {
      playlist: [],
      itemById: {},
      info    : {},
      fetched : {}
    },

    reducers     : {
      build           : {
        prepare: (cId, cuId) => ({ payload: { cId, cuId } }),
        reducer: state => void (state.info = { isReady: false, wip: true })
      },
      buildSuccess    : (state, { payload }) => onBuildSuccess(state, payload),
      singleMediaBuild: state => void (state.info = { isReady: false, wip: true }),
      myPlaylistBuild : {
        prepare: pId => ({ payload: { pId } }),
        reducer: state => void (state.info = { isReady: false, wip: true })
      },

      select: (state, { payload }) => void (state.info = { ...state.info, ...payload }),

      setQuality          : (state, { payload }) => void (state.info.quality = payload),
      setLanguage         : (state, { payload }) => void (state.info.language = payload),
      setSubsLanguage     : (state, { payload }) => void (state.info.subsLanguage = payload),
      setMediaType        : (state, { payload }) => void (onUpdateMediaType(state, payload)),
      nullNextUnit        : (state, { payload = null }) => void (state.info.nextUnitId = payload),
      showImages          : (state, { payload }) => onShowImages(state, payload),
      fetchShowData       : () => void ({}),
      fetchShowDataSuccess: (state, { payload }) => onFetchShowDataSuccess(state, payload)
    },
    extraReducers: builder => {
      builder
        .addCase(settingsActions.setContentLanguages, state => void (state.info = { isReady: false }))
        .addCase(playerActions.playerComplete, onComplete);
    }
  }
);

export default playlistSlice.reducer;

export const { actions } = playlistSlice;

export const types = Object.fromEntries(new Map(
  Object.values(playlistSlice.actions).map(a => [a.type, a.type])
));

const getPlaylist = state => state.playlist;
const getPlayed   = state => state.itemById[state.info.id] || false;
const getInfo     = state => state.info;
const getNextId   = state => {
  const curIdx = state.playlist.findIndex(x => x.id === state.info.id);
  if (state.playlist.length <= curIdx) return false;
  const idx = curIdx + 1;
  return state.playlist[idx]?.id;
};

const getPrevId = state => {
  const curIdx = state.playlist.findIndex(x => x.id === state.info.id);
  if (1 > curIdx) return false;
  const idx = curIdx - 1;
  return state.playlist[idx]?.id;
};

const getIndexById = (state, id) => state.playlist.findIndex(x => x.id === id);
const getItemById  = state => id => state.itemById[id] || false;

const getFetched = state => state.fetched;

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

import { createSlice } from '@reduxjs/toolkit';
import { actions as settingsActions } from './settings';
import { actions as playerActions } from './player';

import { DEFAULT_CONTENT_LANGUAGE, VS_DEFAULT } from '../../helpers/consts';
import { saveTimeOnLocalstorage } from '../../components/Player/Controls/helper';
import { getQualitiesFromLS } from '../../pkg/jwpAdapter/adapter';

export const SHOWED_PLAYLIST_ITEMS = 7;

const onBuildSuccess = (status, payload) => {
  const { cuId, id: _id, items, fetched = {}, ...info } = payload;

  const id     = _id || cuId;
  let language = status.info.language || payload.language || DEFAULT_CONTENT_LANGUAGE;

  //use curId - fix for my playlists
  status.itemById = items.reduce((acc, x, ap) => ({ ...acc, [x.id]: x, ap }), {});
  const curItem   = status.itemById?.[id];
  if (curItem && !curItem.isHLS && (curItem.languages && !curItem.languages.includes(language))) {
    language = curItem.languages[0];
  }

  let { quality } = status.info;
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
  status.playlist = playlist.map((x, i) => {
    const showImg = i > selIndex - 2 && i < selIndex + SHOWED_PLAYLIST_ITEMS;
    const f       = i >= fetched.from && i <= fetched.to;
    return { ...x, showImg, fetched: f };
  });
  status.info     = { ...info, cuId, id, language, subsLanguage: language, quality, isReady: true, wip: false };
  status.fetched  = fetched;
};

const onComplete = status => {
  const idx     = status.playlist.findIndex(x => x.id === status.info.id);
  const lastIdx = status.playlist.length - 1;
  if (idx === lastIdx) return;
  const nextId = status.playlist[(idx < lastIdx) ? idx + 1 : lastIdx]?.id;
  saveTimeOnLocalstorage(1, nextId);
  status.info.nextUnitId = nextId;
};

const onUpdateMediaType = (status, payload) => {
  status.info.mediaType = payload;

  const item = status.itemById[status.info.id] || false;
  if (item.isHLS) {
    status.itemById[status.info.id].id = `${item?.file.id}_${status.info.mediaType}`;
  }
};

const onShowImages = (status, idx) => {
  status.playlist.forEach((x, i) => {
    if (x.showImg) return;
    x.showImg = i > idx - 2 && i < idx + SHOWED_PLAYLIST_ITEMS;
  });
};

const onFetchShowDataSuccess = (status, { items, fetched }) => {
  items.forEach(x => {
    status.itemById[x.id] = x;
  });
  status.fetched = fetched;
  status.playlist.forEach((x, i) => {
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

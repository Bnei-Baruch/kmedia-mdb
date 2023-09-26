import { takeEvery, select, put, call } from 'redux-saga/effects';
import i18n from 'i18next';

import { selectors as authSelectors } from '../authSlice/authSlice';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { selectors as my, selectors } from '../mySlice/mySlice';
import { types, actions, selectors as playlist, playlistSlice } from './playlistSlice';
import { selectors as mdb, mdbSlice } from '../mdbSlice/mdbSlice';
import {
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_REACTIONS,
  IsCollectionContentType,
  MY_NAMESPACE_HISTORY
} from '@/src/helpers/consts';
import { selectSuitableLanguage } from '@/src/helpers/language';
import { canonicalCollection } from '@/src/helpers/utils';
import { getMyItemKey } from '../../../../src/helpers/my';
import {
  calcAvailableLanguages,
  getActivePartFromQuery,
  getLanguageFromQuery,
  getMediaTypeFromQuery,
  playableItem,
  playlist as playlistBuilder,
} from './helper';
import Api, { assetUrl } from '../../../../src/helpers/Api';
import { fetchCollection, fetchUnit, fetchUnitsByIDs, fetchLabels } from '../mdbSlice/thunks';
import { fetchViewsByUIDs } from '@/src/sagas/recommended';
import { fetchOne, fetchMy } from '../mySlice/thunks';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';

const ONE_FETCH_SIZE = 50;
/*

function* build(action) {
  const { cId } = action.payload;
  let { cuId }  = action.payload;

  const { location } = yield select(state => state.router);

  const fetchedC = yield select(state => mdb.getFullCollectionFetched(state.mdb));
  if (!fetchedC?.[cId]) {
    yield call(fetchCollection, { payload: cId });
  }

  let cu = yield select(state => mdb.getDenormContentUnit(state.mdb, cuId));
  if (!cu || !cu.files) {
    yield call(fetchUnit, { payload: cuId });
    cu = yield select(state => mdb.getDenormContentUnit(state.mdb, cuId));
  }

  const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));
  const mediaType = getMediaTypeFromQuery(location);
  const language = getLanguageFromQuery(location) || selectSuitableLanguage(contentLanguages, calcAvailableLanguages(cu), cu.original_language);

  const c    = yield select(state => mdb.getDenormCollection(state.mdb, cId));
  const data = playlistBuilder(c);
  if (!cuId) {
    cuId = data.items[getActivePartFromQuery(location)]?.id;
  }
  const idx     = data.items.findIndex(x => x.id === cuId);
  const fetched = {
    from: Math.max(0, idx - ONE_FETCH_SIZE / 2),
    to: Math.min(data.items.length, idx + ONE_FETCH_SIZE / 2)
  };
  yield put(actions.buildSuccess({ ...data, language, mediaType, cuId, cId, fetched }));
  const uids = data.items.slice(fetched.from, fetched.to).map(x => x.id);
  yield call(fetchPlaylistDataByCUs, { uids, fetched });
  yield fetchLabels({ content_unit: cuId, language });
}
*/

export const buildPlaylist = createAppAsyncThunk(
  'playlist/build',
  async (payload, thunkAPI) => {
    const { cId, query } = payload;
    let cuId             = payload.cuId;

    const state = thunkAPI.getState();

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    await thunkAPI.dispatch(fetchUnit(cuId));
    let cu = mdb.getDenormContentUnit(thunkAPI.getState().mdb, cuId);

    const mediaType = getMediaTypeFromQuery(query);
    const language  = getLanguageFromQuery(query) || selectSuitableLanguage(contentLanguages, calcAvailableLanguages(cu), cu.original_language);

    await thunkAPI.dispatch(fetchCollection(cId));
    const c = mdb.getDenormCollection(thunkAPI.getState().mdb, cId);

    const data = playlistBuilder(c);
    if (!cuId) {
      cuId = data.items[getActivePartFromQuery(query)]?.id;
    }
    const idx     = data.items.findIndex(x => x.id === cuId);
    const fetched = {
      from: Math.max(0, idx - ONE_FETCH_SIZE / 2),
      to: Math.min(data.items.length, idx + ONE_FETCH_SIZE / 2)
    };
    const uids    = data.items.slice(fetched.from, fetched.to).map(x => x.id);
    await fetchPlaylistDataByCUs(uids, fetched, thunkAPI);
    fetchLabels({ content_unit: cuId, language });
    return { ...data, language, mediaType, cuId, cId, fetched };
  }
);

function* fetchShowData(action) {
  const dir            = action.payload;
  const { ...fetched } = yield select(state => playlist.getFetched(state.playlist));

  if (dir === -1)
    fetched.from = Math.max(0, fetched.from - ONE_FETCH_SIZE);
  else
    fetched.to = Math.max(0, fetched.to + ONE_FETCH_SIZE);

  const _playlist = yield select(state => playlist.getPlaylist(state.playlist));
  const uids      = _playlist.slice(fetched.from, fetched.to).filter(x => !x.fetched).map(x => x.id);

  yield call(fetchPlaylistDataByCUs, { uids, fetched });
}

async function fetchPlaylistDataByCUs(uids, fetched, thunkAPI) {
  if (uids.length > 0) {
    await thunkAPI.dispatch(fetchUnitsByIDs({ id: uids, with_files: true }));
  }

  mdb.getDenormContentUnit(thunkAPI.getState().mdb);
  const state = thunkAPI.getState();
  const items = uids
    .map(uid => mdb.getDenormContentUnit(state.mdb, uid))
    .map(cu => playableItem(cu));
  thunkAPI.dispatch(playlistSlice.actions.fetchShowDataSuccess({ items, fetched }));

  //fetchViewsByUIDs(uids);
  thunkAPI.dispatch(fetchMy({ namespace: MY_NAMESPACE_HISTORY, uids, page_size: uids.length }));
}

function* singleMediaBuild(action) {
  const cuId = action.payload;

  const { location } = yield select(state => state.router);

  let cu = yield select(state => mdb.getDenormContentUnit(state.mdb, cuId));
  if (!cu || !cu.files) {
    yield call(fetchUnit, { payload: cuId });
    cu = yield select(state => mdb.getDenormContentUnit(state.mdb, cuId));
  }

  const c = canonicalCollection(cu) || false;

  const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));

  const mediaType   = getMediaTypeFromQuery(location);
  // DONT COMMIT: This should also take into account files languages, not just content languages.
  const language    = getLanguageFromQuery(location) || selectSuitableLanguage(contentLanguages, calcAvailableLanguages(cu), cu.original_language);
  const preImageUrl = !!c ? assetUrl(`logos/collections/${c.id}.jpg`) : null;
  const item        = playableItem(cu, preImageUrl);

  yield put(actions.buildSuccess({ items: [item], language, mediaType, cuId, cId: c.id, isSingleMedia: true }));
  yield fetchViewsByUIDs([cuId]);
  yield fetchMy({ payload: { namespace: MY_NAMESPACE_HISTORY, cu_uids: [cuId], page_size: 1 } });
  yield fetchLabels({ content_unit: cuId, language });

}

/*

function* myPlaylistBuild(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;

  const { pId } = action.payload;

  const { items: data, name } = (pId === MY_NAMESPACE_REACTIONS) ?
    yield fetchMyReactions() : yield fetchMyPlaylist(pId);

  const content_units = yield select(state => data?.map(x => ({
      ...mdb.getDenormContentUnit(state.mdb, x.content_unit_uid),
      name: x.name,
      properties: x.properties
    })
  ).filter(x => !!x)) || [];

  const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));

  const { location } = yield select(state => state.router);
  const mediaType    = getMediaTypeFromQuery(location);
  const ap           = getActivePartFromQuery(location);
  const items        = content_units
    .map(cu => playableItem(cu))
    //change cu id cause on personal playlist item can save few items of one CU
    .map((x, i) => ({ ...x, id: `${x.id}_${i}`, cuId: x.id, ap: i }));
  const { cuId, id } = items[ap] || items[0];
  const baseLink     = `/${MY_NAMESPACE_PLAYLISTS}/${pId}`;

  const cu           = items.find(item => item?.id === cuId);
  const language     = getLanguageFromQuery(location) || selectSuitableLanguage(contentLanguages, calcAvailableLanguages(cu), cu.original_language);

  yield put(actions.buildSuccess({ items, id, cuId, name, language, mediaType, pId, baseLink, isMy: true }));

  const cu_uids = content_units.map(c => c.id);
  yield fetchViewsByUIDs(cu_uids);
  yield fetchMy({ payload: { namespace: MY_NAMESPACE_HISTORY, cu_uids, page_size: cu_uids.length } });
  yield fetchLabels({ content_unit: cuId, language });
}

function* fetchMyPlaylist(id) {
  const { key }    = getMyItemKey(MY_NAMESPACE_PLAYLISTS, { id });
  let playlistData = yield select(state => my.getItemByKey(state.my, MY_NAMESPACE_PLAYLISTS, key));

  if (!playlistData) {
    yield call(fetchOne, { payload: { namespace: MY_NAMESPACE_PLAYLISTS, id } });
    playlistData = yield select(state => my.getItemByKey(state.my, MY_NAMESPACE_PLAYLISTS, key));
  }

  return playlistData;
}

function* fetchMyReactions() {
  yield call(fetchMy, {
    payload: {
      namespace: MY_NAMESPACE_REACTIONS,
      params: { page_no: 1, page_size: 100, with_files: true }
    }
  });
  const data = yield select(state => selectors.getList(state.my, MY_NAMESPACE_REACTIONS));
  const id   = data.filter(x => !IsCollectionContentType(x.subject_type))
    .map(x => x.subject_uid);

  yield call(fetchUnitsByIDs, { payload: { id, with_files: true } });
  const name  = i18n.t('personal.reactions');
  const items = id.map(x => ({ content_unit_uid: x }));
  return { items, name };

}
*/

function* watchBuild() {
  yield takeEvery(types.PLAYLIST_BUILD, build);
}

function* watchFetchShowData() {
  yield takeEvery(types.FETCH_SHOW_DATA, fetchShowData);
}

function* watchSingleMediaBuild() {
  yield takeEvery(types.SINGLE_MEDIA_BUILD, singleMediaBuild);
}

function* watchMyPlaylistBuild() {
  yield takeEvery(types.MY_PLAYLIST_BUILD, myPlaylistBuild);
}

export const sagas = [watchBuild, watchFetchShowData, watchSingleMediaBuild, watchMyPlaylistBuild];

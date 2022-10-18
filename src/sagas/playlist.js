import { takeEvery, select, put, call } from 'redux-saga/effects';

import { selectors as authSelectors } from '../redux/modules/auth';
import { selectors as settings } from '../redux/modules/settings';
import { selectors as my } from '../redux/modules/my';
import { types, actions } from '../redux/modules/playlist';
import { selectors as mdb } from '../redux/modules/mdb';
import { MY_NAMESPACE_PLAYLISTS } from '../helpers/consts';
import { canonicalCollection } from '../helpers/utils';
import { getMyItemKey } from '../helpers/my';
import playerHelper from '../helpers/player';
import { assetUrl } from '../helpers/Api';
import { fetchCollection, fetchUnit, fetchUnitsByIDs } from './mdb';
import { fetchViewsByUIDs } from './recommended';
import { fetchOne } from './my';

function* build(action) {
  const { cId } = action.payload;
  let { cuId }  = action.payload;

  const { location } = yield select(state => state.router);

  const fetched = yield select(state => mdb.getFullCollectionFetched(state.mdb));
  if (!fetched?.[cId]) {
    yield call(fetchCollection, { payload: cId });
  }
  let c = yield select(state => mdb.getDenormCollection(state.mdb, cId));

  if (!cuId) {
    cuId = c.cuIDs?.[playerHelper.getActivePartFromQuery(location)];
  }

  const cu = yield select(state => mdb.getDenormContentUnit(state.mdb, cuId));
  if (!cu) {
    yield call(fetchUnit, { payload: cuId });
    yield select(state => mdb.getDenormContentUnit(state.mdb, cuId));
  }

  {
    const id = c.content_units.filter(cu => !cu.files).map(x => x.id) || [];
    if (id.length > 0) {
      yield call(fetchUnitsByIDs, { payload: { id, with_files: true } });
      c = yield select(state => mdb.getDenormCollection(state.mdb, cId));
    }
  }

  const siteLang    = yield select(state => settings.getLanguage(state.settings));
  const contentLang = yield select(state => settings.getContentLanguage(state.settings));

  const mediaType = playerHelper.getMediaTypeFromQuery(location);
  const language  = playerHelper.getLanguageFromQuery(location, siteLang || contentLang);

  const data = playerHelper.playlist(c);

  yield put(actions.buildSuccess({ ...data, language, mediaType, cuId, cId }));
  yield fetchViewsByUIDs(data.items.map(x => x.id));
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

  const siteLang    = yield select(state => settings.getLanguage(state.settings));
  const contentLang = yield select(state => settings.getContentLanguage(state.settings));

  const mediaType   = playerHelper.getMediaTypeFromQuery(location);
  const language    = playerHelper.getLanguageFromQuery(location, siteLang || contentLang);
  const preImageUrl = !!c ? assetUrl(`logos/collections/${c.id}.jpg`) : null;
  const item        = playerHelper.playableItem(cu, preImageUrl);

  yield put(actions.buildSuccess({ items: [item], language, mediaType, cuId, cId: c.id, isSingleMedia: true }));
  yield fetchViewsByUIDs([cuId]);
}

function* myPlaylistBuild(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;

  const { pId }    = action.payload;
  const { key }    = getMyItemKey(MY_NAMESPACE_PLAYLISTS, { id: pId });
  let playlistData = yield select(state => my.getItemByKey(state.my, MY_NAMESPACE_PLAYLISTS, key));

  if (!playlistData) {
    yield call(fetchOne, { payload: { namespace: MY_NAMESPACE_PLAYLISTS, id: pId } });
    playlistData = yield select(state => my.getItemByKey(state.my, MY_NAMESPACE_PLAYLISTS, key));
  }
  const content_units = yield select(state => playlistData.items?.map(x => mdb.getDenormContentUnit(state.mdb, x.content_unit_uid)).filter(x => !!x)) || [];

  const siteLang    = yield select(state => settings.getLanguage(state.settings));
  const contentLang = yield select(state => settings.getContentLanguage(state.settings));

  const { location } = yield select(state => state.router);
  const mediaType    = playerHelper.getMediaTypeFromQuery(location);
  const language     = playerHelper.getLanguageFromQuery(location, siteLang || contentLang);
  const ap           = playerHelper.getActivePartFromQuery(location);
  const items        = content_units.map(cu => playerHelper.playableItem(cu));
  const cuId         = items[ap]?.id || items[0].id;
  const baseLink     = `/${siteLang}/${MY_NAMESPACE_PLAYLISTS}/${pId}`;

  yield put(actions.buildSuccess({ items, cuId, name: playlistData.name, language, mediaType, pId, baseLink }));

  const cuUIDs = content_units.map(c => c.id);
  yield fetchViewsByUIDs(cuUIDs);
}

function* watchBuild() {
  yield takeEvery(types.PLAYLIST_BUILD, build);
}

function* watchSingleMediaBuild() {
  yield takeEvery(types.SINGLE_MEDIA_BUILD, singleMediaBuild);
}

function* watchMyPlaylistBuild() {
  yield takeEvery(types.MY_PLAYLIST_BUILD, myPlaylistBuild);
}

export const sagas = [watchBuild, watchSingleMediaBuild, watchMyPlaylistBuild];

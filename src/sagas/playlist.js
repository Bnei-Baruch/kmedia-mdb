import { takeEvery, select, put, call } from 'redux-saga/effects';

import playerHelper from '../helpers/player';
import { selectors as settings } from '../redux/modules/settings';
import { types, actions } from '../redux/modules/playlist';
import { selectors as mdb } from '../redux/modules/mdb';
import { fetchCollection, fetchUnit, fetchUnitsByIDs } from './mdb';
import { fetchViewsByUIDs } from './recommended';
import { canonicalCollection } from '../helpers/utils';
import { assetUrl } from '../helpers/Api';

function* build(action) {
  const { cId } = action.payload;
  let { cuId }  = action.payload;

  const { location } = yield select(state => state.router);

  let c = yield select(state => mdb.getDenormCollection(state.mdb, cId));
  if (!c) {
    yield put(fetchCollection({ id: cId }));
    c = yield select(state => mdb.getDenormCollection(state.mdb, cId));
  }

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
  const preImageUrl = c ? assetUrl(`logos/collections/${c.id}.jpg`) : null;
  const item        = playerHelper.playableItem(cu, preImageUrl);

  yield put(actions.buildSuccess({ items: [item], language, mediaType, cuId, cId: c.id, isSingleMedia: true }));
  yield fetchViewsByUIDs([cuId]);
}

function* watchBuild() {
  yield takeEvery(types.PLAYLIST_BUILD, build);
}

function* watchSingleMediaBuild() {
  yield takeEvery(types.SINGLE_MEDIA_BUILD, singleMediaBuild);
}

export const sagas = [watchBuild, watchSingleMediaBuild];

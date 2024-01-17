import { call, put, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { types, actions } from '../redux/modules/assets';

function* unzip(action) {
  const id = action.payload;

  try {
    const { data } = yield call(Api.getAsset, `api/unzip/${id}`);
    const payload  = { id, data };
    yield put(actions.unzipSuccess(action.type, payload));
  } catch (err) {
    const payload = { id, err };
    yield put(actions.unzipFailure(action.type, payload));
  }
}

function* unzipList(action) {
  const ids = action.payload;

  try {
    const { data } = yield call(Api.getUnzipUIDs, { path: 'api/unzip_uids', ids });
    const payload  = { ids, data };
    yield put(actions.unzipListSuccess(action.type, payload));
  } catch (err) {
    const payload = { ids, err };
    yield put(actions.unzipListFailure(action.type, payload));
  }
}

export function* doc2Html(action) {
  const id = action.payload;

  try {
    const { data } = yield call(Api.getAsset, `api/doc2html/${id}`);
    const payload  = { id, data };
    yield put(actions.doc2htmlSuccess(action.type, payload));
  } catch (err) {
    const payload = { id, err };
    yield put(actions.doc2htmlFailure(action.type, payload));
  }
}

export function* fetchAsset(action) {
  try {
    const { data } = yield call(Api.getAsset, action.payload);
    yield put(actions.fetchAssetSuccess(data));
  } catch (err) {
    yield put(actions.fetchAssetFailure(err));
  }
}

export function* fetchPerson(action) {
  try {
    const { data } = yield call(Api.getCMS, 'person', {
      contentLanguages: action.payload.contentLanguages,
      id: action.payload.sourceId
    });
    yield put(actions.fetchPersonSuccess(data));
  } catch (err) {
    yield put(actions.fetchPersonFailure(err));
  }
}

function* fetchTimeCode(action) {
  const { uid, language } = action.payload;

  try {
    const { data } = yield call(Api.getAsset, `api/time_code?uid=${uid}&language=${language}`);
    yield put(actions.fetchTimeCodeSuccess(data));
  } catch (e) {
    console.error('fetch time code', e);
  }
}

function* mergeKiteiMakor(action) {
  const { id, language } = action.payload;

  try {
    const { data } = yield call(Api.getAsset, `api/km_audio/build/${id}?language=${language}`);
    yield put(actions.mergeKiteiMakorSuccess({ id, language, status: data.status }));
  } catch (e) {
    yield put(actions.mergeKiteiMakorFailure({ id, language, status: e.message }));
  }
}

function* watchUnzip() {
  yield takeLatest(types['assets/unzip'], unzip);
}

function* watchUnzipList() {
  yield takeLatest(types['assets/unzipList'], unzipList);
}

function* watchDoc2Html() {
  yield takeLatest([types['assets/doc2html']], doc2Html);
}

function* watchFetchAsset() {
  yield takeLatest([types['assets/fetchAsset']], fetchAsset);
}

function* watchFetchPerson() {
  yield takeLatest([types['assets/fetchPerson']], fetchPerson);
}

function* watchFetchTimeCode() {
  yield takeLatest([types['assets/fetchTimeCode']], fetchTimeCode);
}

function* watchMergeKiteiMakor() {
  yield takeLatest(types['assets/mergeKiteiMakor'], mergeKiteiMakor);
}

export const sagas = [
  watchUnzip,
  watchUnzipList,
  watchDoc2Html,
  watchFetchAsset,
  watchFetchPerson,
  watchFetchTimeCode,
  watchMergeKiteiMakor
];

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/assets';

function* unzip(action) {
  const id = action.payload;

  try {
    const { data } = yield call(Api.getAsset, `api/unzip/${id}`);
    yield put(actions.unzipSuccess(id, data));
  } catch (err) {
    yield put(actions.unzipFailure(id, err));
  }
}

function* unzipList(action) {
  const ids = action.payload;

  try {
    const { data } = yield call(Api.getUnzipUIDs, { path: 'api/unzip_uids', ids });
    yield put(actions.unzipListSuccess(data));
  } catch (err) {
    yield put(actions.unzipListFailure(ids, err));
  }
}

function* doc2Html(action) {
  const id = action.payload;

  try {
    const { data } = yield call(Api.getAsset, `api/doc2html/${id}`);
    yield put(actions.doc2htmlSuccess(id, data));
  } catch (err) {
    yield put(actions.doc2htmlFailure(id, err));
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
      id: action.payload.sourceId,
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
    yield put(actions.mergeKiteiMAkorSuccess({ id, language, status: data }));
  } catch (e) {
    yield put(actions.mergeKiteiMAkorFailure({ id, language, status: e }));
  }
}

function* watchUnzip() {
  yield takeLatest(types.UNZIP, unzip);
}

function* watchUnzipList() {
  yield takeLatest(types.UNZIP_LIST, unzipList);
}

function* watchDoc2Html() {
  yield takeLatest([types.DOC2HTML], doc2Html);
}

function* watchFetchAsset() {
  yield takeLatest([types.FETCH_ASSET], fetchAsset);
}

function* watchFetchPerson() {
  yield takeLatest([types.FETCH_PERSON], fetchPerson);
}

function* watchFetchTimeCode() {
  yield takeLatest([types.FETCH_TIME_CODE], fetchTimeCode);
}

function* watchMergeKiteiMakor() {
  yield takeLatest(types.MERGE_KITEI_MAKOR, mergeKiteiMakor);
}

export const sagas = [
  watchUnzip,
  watchUnzipList,
  watchDoc2Html,
  watchFetchAsset,
  watchFetchPerson,
  watchFetchTimeCode,
  watchMergeKiteiMakor,
];

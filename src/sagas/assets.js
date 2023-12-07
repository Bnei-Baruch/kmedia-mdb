import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import {
  types,
  fetchAssetSuccess,
  fetchAssetFailure,
  sourceIndexSuccess,
  sourceIndexFailure,
  unzipSuccess,
  unzipFailure,
  unzipListSuccess,
  unzipListFailure,
  doc2htmlSuccess,
  doc2htmlFailure,
  fetchPersonFailure,
  fetchPersonSuccess,
  fetchTimeCodeSuccess,
  mergeKiteiMakorSuccess,
  mergeKiteiMakorFailure
} from '../redux/modules/assets';
import { cuFilesToData, getSourceIndexId } from './helpers/utils';

function* unzip(action) {
  const id = action.payload;

  try {
    const { data } = yield call(Api.getAsset, `api/unzip/${id}`);
    const payload  = { id, data };
    yield put(unzipSuccess(action.type, payload));
  } catch (err) {
    const payload = { id, err };
    yield put(unzipFailure(action.type, payload));
  }
}

function* unzipList(action) {
  const ids = action.payload;

  try {
    const { data } = yield call(Api.getUnzipUIDs, { path: 'api/unzip_uids', ids });
    const payload  = { ids, data };
    yield put(unzipListSuccess(action.type, payload));
  } catch (err) {
    const payload = { ids, err };
    yield put(unzipListFailure(action.type, payload));
  }
}

function* doc2Html(action) {
  const id = action.payload;

  try {
    const { data } = yield call(Api.getAsset, `api/doc2html/${id}`);
    const payload  = { id, data };
    yield put(doc2htmlSuccess(action.type, payload));
  } catch (err) {
    const payload = { id, err };
    yield put(doc2htmlFailure(action.type, payload));
  }
}

export function* sourceIndex(action) {
  try {
    const id      = getSourceIndexId(action);
    const cu      = yield call(Api.unit, { id });
    const payload = { id: action.payload, data: cuFilesToData(cu.data) };
    yield put(sourceIndexSuccess(action.type, payload));
  } catch (err) {
    const payload = { id: action.payload, err };
    yield put(sourceIndexFailure(action.type, payload));
  }
}

export function* fetchAsset(action) {
  try {
    const { data } = yield call(Api.getAsset, action.payload);
    yield put(fetchAssetSuccess(data));
  } catch (err) {
    yield put(fetchAssetFailure(err));
  }
}

export function* fetchPerson(action) {
  try {
    const { data } = yield call(Api.getCMS, 'person', {
      contentLanguages: action.payload.contentLanguages,
      id              : action.payload.sourceId
    });
    yield put(fetchPersonSuccess(data));
  } catch (err) {
    yield put(fetchPersonFailure(err));
  }
}

function* fetchTimeCode(action) {
  const { uid, language } = action.payload;

  try {
    const { data } = yield call(Api.getAsset, `api/time_code?uid=${uid}&language=${language}`);
    yield put(fetchTimeCodeSuccess(data));
  } catch (e) {
    console.error('fetch time code', e);
  }
}

function* mergeKiteiMakor(action) {
  const { id, lang } = action.payload;

  try {
    const { data } = yield call(Api.getAsset, `api/km_audio/build/${id}?language=${lang}`);
    yield put(mergeKiteiMakorSuccess({ id, lang, status: data }));
  } catch (e) {
    yield put(mergeKiteiMakorFailure({ id, lang, status: e }));
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

function* watchSourceIndex() {
  yield takeEvery([types['assets/sourceIndex']], sourceIndex);
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
  watchSourceIndex,
  watchFetchAsset,
  watchFetchPerson,
  watchFetchTimeCode,
  watchMergeKiteiMakor
];

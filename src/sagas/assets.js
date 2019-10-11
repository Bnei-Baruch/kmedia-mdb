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

function* doc2Html(action) {
  const id = action.payload;

  try {
    const { data } = yield call(Api.getAsset, `api/doc2html/${id}`);
    yield put(actions.doc2htmlSuccess(id, data));
  } catch (err) {
    yield put(actions.doc2htmlFailure(id, err));
  }
}

export function* sourceIndex(action) {
  try {
    let id = action.payload;
    if (/^gr-/.test(id)) { // Rabash Group Articles
      const result = /^gr-(.+)/.exec(id);
      id           = result[1];
    }
    const { data } = yield call(Api.getAsset, `sources/${id}/index.json`);
    yield put(actions.sourceIndexSuccess(action.payload, data));
  } catch (err) {
    yield put(actions.sourceIndexFailure(action.payload, err));
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
      language: action.payload.language,
      id: action.payload.sourceId,
    });
    yield put(actions.fetchPersonSuccess(data));
  } catch (err) {
    yield put(actions.fetchPersonFailure(err));
  }
}

function* watchUnzip() {
  yield takeLatest(types.UNZIP, unzip);
}

function* watchDoc2Html() {
  yield takeLatest([types.DOC2HTML], doc2Html);
}

function* watchSourceIndex() {
  yield takeEvery([types.SOURCE_INDEX], sourceIndex);
}

function* watchFetchAsset() {
  yield takeLatest([types.FETCH_ASSET], fetchAsset);
}

function* watchFetchPerson() {
  yield takeLatest([types.FETCH_PERSON], fetchPerson);
}

export const sagas = [
  watchUnzip,
  watchDoc2Html,
  watchSourceIndex,
  watchFetchAsset,
  watchFetchPerson,
];

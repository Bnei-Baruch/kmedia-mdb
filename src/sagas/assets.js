import { call, put, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/assets';

function* unzip(action) {
  const id = action.payload;

  try {
    const { data } = yield call(Api.unzip, { id });
    yield put(actions.unzipSuccess(id, data));
  } catch (err) {
    yield put(actions.unzipFailure(id, err));
  }
}

function* doc2Html(action) {
  const id = action.payload;

  try {
    const { data } = yield call(Api.doc2Html, { id });
    yield put(actions.doc2htmlSuccess(id, data));
  } catch (err) {
    yield put(actions.doc2htmlFailure(id, err));
  }
}

function* watchUnzip() {
  yield takeLatest(types.UNZIP, unzip);
}

function* watchDoc2Html() {
  yield takeLatest([types.DOC2HTML], doc2Html);
}

export const sagas = [
  watchUnzip,
  watchDoc2Html,
];

import { call, put, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/staticFiles';

export function* fetchStatic(action) {
  try {
    const { data } = yield call(Api.staticFile, action.payload);
    yield put(actions.fetchStaticSuccess(data));
  } catch (err) {
    yield put(actions.fetchStaticFailure(err));
  }
}

function* watchFetchStatic() {
  yield takeLatest(types.FETCH_STATIC, fetchStatic);
}

export const sagas = [
  watchFetchStatic,
];

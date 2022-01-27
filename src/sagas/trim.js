import { call, put, takeEvery } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/trim';

export function* trim(action) {
  try {
    const { data } = yield call(Api.trimFile, action.payload);
    yield put(actions.trimSuccess(data));
  } catch (err) {
    yield put(actions.trimFailure(err));
  }
}

function* watchTrim() {
  yield takeEvery([types.TRIM], trim);
}

export const sagas = [
  watchTrim,
];

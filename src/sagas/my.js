import { call, put, takeEvery } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/my';
import Api from '../helpers/Api';

function* addLike(action) {
  const { ...args } = action.payload;
  try {
    const { data } = yield call(Api.likes, args);
    yield put(actions.addLikeSuccess(data));
  } catch (err) {
    yield put(actions.addLikeFailure(err));
  }
}

function* watchAddLike() {
  yield takeEvery(types.ADD_LIKE, addLike);
}

export const sagas = [
  watchAddLike,
];

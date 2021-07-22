import { call, put, select, takeEvery } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/my';
import Api from '../helpers/Api';
import { selectors as authSelectors } from '../redux/modules/auth';
import { actions as mdbActions } from '../redux/modules/mdb';

function* addLike(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  try {
    const { data } = yield call(Api.likes, action.payload, token, 0, 10, 'POST');
    yield put(actions.addLikeSuccess(data));
  } catch (err) {
    yield put(actions.addLikeFailure(err));
  }
}

function* fetchLikes(action) {
  const token    = yield select(state => authSelectors.getToken(state.auth));
  try {
    const { data }                    = yield call(Api.likes, action.payload, token);
    const { data: { content_units } } = yield call(Api.units, {
      id: data.content_units,
      pageSize: data.content_units.length
    });
    yield put(mdbActions.receiveContentUnits(content_units));
    yield put(actions.fetchLikesSuccess(data));
  } catch (err) {
    yield put(actions.fetchLikesFailure(err));
  }
}

function* watchAddLike() {
  yield takeEvery(types.ADD_LIKE, addLike);
}

function* watchFetchLikes() {
  yield takeEvery(types.FETCH_LIKES, fetchLikes);
}

export const sagas = [
  watchAddLike,
  watchFetchLikes,
];

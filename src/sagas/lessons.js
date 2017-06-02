import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/lessons';
import LessonApi from '../api/Api';

function* fetchList(action) {
  try {
    const resp = yield call(LessonApi.all, action.payload);
    console.log("SAGA fetchList:", resp);
    yield put(actions.fetchListSuccess(resp));
  } catch (err) {
    yield put(actions.fetchListFailure(err));
  }
}

function* watchFetchList() {
  yield takeLatest(types.FETCH_LIST, fetchList);
}

export const sagas = [
  watchFetchList,
];

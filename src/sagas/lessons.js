import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/lessons';
import LessonApi from '../api/Api';

function* fetchList(action) {
  try {
    const resp = yield call(LessonApi.all, action.payload);
    yield put(actions.fetchListSuccess(resp));
  } catch (err) {
    yield put(actions.fetchListFailure(err));
  }
}

function* watchFetchList() {
  yield takeLatest(types.FETCH_LIST, fetchList);
}

function* fetchLesson(action) {
  try {
    const resp = yield call(LessonApi.get, action.payload);
    yield put(actions.fetchLessonSuccess(resp));
  } catch (err) {
    yield put(actions.fetchLessonFailure(err));
  }
}

function* watchFetchLesson() {
  yield takeLatest(types.FETCH_LESSON, fetchLesson);
}

export const sagas = [
  watchFetchList,
  watchFetchLesson,
];

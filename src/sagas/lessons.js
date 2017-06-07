import { call, put, takeLatest, select } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/lessons';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { LessonApi } from '../api/Api';
import filterToParams from '../api/filterToParams';

function* fetchList(action) {
  try {
    const filters = yield select(state => filterSelectors.getFilters(state.filters, 'lessons'));
    const params = filters.reduce((acc, filter) => ({
      ...acc,
      ...filterToParams(filter.name)(filter.values)
    }), {});
    const resp = yield call(LessonApi.all, { ...action.payload, ...params });
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

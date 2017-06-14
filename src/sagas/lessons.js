import { call, put, select, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/lessons';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { LessonApi } from '../api/Api';
import filterDefinitions from '../filters';

function* fetchList(action) {
    const filters = yield select(state => filterSelectors.getFilters(state.filters, 'lessons'));
    const params  = filterDefinitions.toApiParams(filters);
  try {
    const resp    = yield call(LessonApi.all, { ...action.payload, ...params });

    if (Array.isArray(resp.collections)) {
      yield put(mdbActions.receiveCollections(resp.collections));
    }
    if (Array.isArray(resp.content_units)) {
      yield put(mdbActions.receiveContentUnits(resp.content_units));
    }

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
    yield put(mdbActions.receiveContentUnits([resp]));
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

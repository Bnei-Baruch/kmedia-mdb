import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../api/Api';
import { updateQuery } from './helpers/url';
import { actions, types } from '../redux/modules/lessons';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';

function* fetchList(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, 'lessons'));
  const params  = filtersTransformer.toApiParams(filters);
  try {
    const resp = yield call(Api.lessons, { ...action.payload, ...params });

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

function* updatePageInQuery(action) {
  const page = action.payload > 1 ? action.payload : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

function* fetchLesson(action) {
  try {
    const resp = yield call(Api.unit, action.payload);
    yield put(mdbActions.receiveContentUnits([resp]));
    yield put(actions.fetchLessonSuccess(resp));
  } catch (err) {
    yield put(actions.fetchLessonFailure(err));
  }
}

function* watchFetchList() {
  yield takeLatest(types.FETCH_LIST, fetchList);
}

function* watchFetchLesson() {
  yield takeLatest(types.FETCH_LESSON, fetchLesson);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [
  watchFetchList,
  watchFetchLesson,
  watchSetPage,
];

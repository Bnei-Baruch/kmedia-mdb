import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { updateQuery } from './helpers/url';
import { selectors as settings } from '../redux/modules/settings';
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

      // TODO edo: optimize data fetching
      // Here comes another call for all content_units we got
      // in order to fetch their possible additional collections.
      // We need this to show 'related to' second line in list.
      // This second round trip to the API is awful,
      // we should strive for a single call to the API and get all the data we need.
      // hmm, relay..., hmm ?
      const cuIDsToFetch = resp.collections.reduce((acc, val) => {
        if (Array.isArray(val.content_units)) {
          return acc.concat(val.content_units.map(x => x.id));
        }
        return acc;
      }, []);
      const language     = yield select(state => settings.getLanguage(state.settings));
      const pageSize     = cuIDsToFetch.length;
      const resp2        = yield call(Api.units, { id: cuIDsToFetch, pageSize, language });
      yield put(mdbActions.receiveContentUnits(resp2.content_units));
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

function* fetchLessonPart(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const response = yield call(Api.unit, { id: action.payload, language });
    yield put(mdbActions.receiveContentUnits([response]));
    yield put(actions.fetchLessonPartSuccess(action.payload));
  } catch (err) {
    yield put(actions.fetchLessonPartFailure(action.payload, err));
  }
}

function* fetchFullLesson(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const response = yield call(Api.collection, { id: action.payload, language });
    yield put(mdbActions.receiveCollections([response]));
    yield put(actions.fetchFullLessonSuccess(action.payload));
  } catch (err) {
    yield put(actions.fetchFullLessonFailure(action.payload, err));
  }
}

function* watchFetchList() {
  yield takeLatest(types.FETCH_LIST, fetchList);
}

function* watchFetchLessonPart() {
  yield takeEvery(types.FETCH_LESSON_PART, fetchLessonPart);
}

function* watchFetchFullLesson() {
  yield takeEvery(types.FETCH_FULL_LESSON, fetchFullLesson);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [
  watchFetchList,
  watchFetchLessonPart,
  watchSetPage,
  watchFetchFullLesson
];

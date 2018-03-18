import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';
import { actions as sources } from '../redux/modules/sources';
import { actions as tags } from '../redux/modules/tags';
import { actions as publications } from '../redux/modules/publications';

export function* fetchUnit(action) {
  const id = action.payload;
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.unit, { id, language });
    yield put(actions.fetchUnitSuccess(id, data));
  } catch (err) {
    yield put(actions.fetchUnitFailure(id, err));
  }
}

export function* fetchCollection(action) {
  const id = action.payload;
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collection, { id, language });
    yield put(actions.fetchCollectionSuccess(id, data));
  } catch (err) {
    yield put(actions.fetchCollectionFailure(id, err));
  }
}

export function* fetchLatestLesson() {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.latestLesson, { language });
    yield put(actions.fetchLatestLessonSuccess(data));
  } catch (err) {
    yield put(actions.fetchCollectionFailure(err.id, err));
  }
}

export function* fetchSQData() {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.sqdata, { language });
    yield put(sources.fetchSourcesSuccess(data.sources));
    yield put(tags.fetchTagsSuccess(data.tags));
    yield put(publications.fetchPublishersSuccess({ publishers: data.publishers, total: data.publishers.length }));
  } catch (err) {
    console.error('Error loading Semi-Quasi data', err);
  }
}

function* watchFetchUnit() {
  yield takeEvery(types.FETCH_UNIT, fetchUnit);
}

function* watchFetchCollection() {
  yield takeEvery(types.FETCH_COLLECTION, fetchCollection);
}

function* watchFetchLatestLesson() {
  yield takeEvery(types.FETCH_LATEST_LESSON, fetchLatestLesson);
}

function* watchFetchSQData() {
  yield takeLatest(types.FETCH_SQDATA, fetchSQData);
}

export const sagas = [
  watchFetchUnit,
  watchFetchCollection,
  watchFetchLatestLesson,
  watchFetchSQData
];

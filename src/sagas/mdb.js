import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, selectors as mdbSelectors, types } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';
import { actions as sources } from '../redux/modules/sources';
import { actions as tags } from '../redux/modules/tags';
import { actions as publications } from '../redux/modules/publications';
import { selectors as authSelectors } from '../redux/modules/auth';

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

export function* fetchUnitsByIDs(action) {
  const { id } = action.payload;
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.units, { ...action.payload, language, page_size: id.length });
    yield put(actions.fetchUnitsByIDsSuccess(data.content_units));
  } catch (err) {
    yield put(actions.fetchUnitsByIDsSuccess({ id, err }));
  }
}

export function* fetchCollectionsByIDs(action) {
  const { id } = action.payload;
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collections, { ...action.payload, language, page_size: id.length });
    yield put(actions.receiveCollections(data.collections));
  } catch (err) {
    yield put(actions.fetchCollectionsByIDsFailure({ id, err }));
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

export function* fetchWindow(action) {
  const { id } = action.payload;
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const args     = {
      ...action.payload, language,
    };
    const { data } = yield call(Api.lessons, args);
    yield put(actions.fetchWindowSuccess(id, data));
  } catch (err) {
    yield put(actions.fetchWindowFailure(id, err));
  }
}

export function* fetchDatepickerCO(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const args     = { ...action.payload, language };
    const { data } = yield call(Api.lessons, args);
    yield put(actions.fetchDatepickerCOSuccess(data));
  } catch (err) {
    yield put(actions.fetchDatepickerCOFailure(err));
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
    yield put(sources.receiveSources({ sources: data.sources, language }));
    yield put(tags.receiveTags(data.tags));
    yield put(publications.receivePublishers(data.publishers));
    yield put(actions.fetchSQDataSuccess());
  } catch (err) {
    yield put(actions.fetchSQDataFailure(err));
  }
}

export function* countCU(action) {
  const { params, namespace } = action.payload;
  try {
    const { data: { total } } = yield call(Api.countCU, params);
    yield put(actions.countCUSuccess(namespace, total));
  } catch (err) {
    yield put(actions.countCUFailure(err));
  }
}

function* createLabel(action) {
  try {
    const token = yield select(state => authSelectors.getToken(state.auth));
    if (!token) new Error('token is required');

    const { data: { uid } } = yield call(Api.mdbCreateLabel, action.payload, token);

    const language             = yield select(state => settings.getLanguage(state.settings));
    const { data: { labels } } = yield call(Api.labels, { id: uid, language });
    yield put(actions.receiveLabels(labels));
  } catch (err) {
    console.log(err);
  }
}

export function* fetchLabels(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const params   = { ...action.payload, language };
    const { data } = yield call(Api.labels, params);
    yield put(actions.receiveLabels(data.labels));
    yield put(actions.fetchLabelsSuccess(data));
  } catch (err) {
    console.error('fetchLabels errors', err);
  }
}

export function* fetchMissingUnits(uids) {
  const missingUnitIds = yield select(state => uids.filter(uid => !mdbSelectors.getUnitById(state.mdb, uid)));

  if (missingUnitIds.length > 0) {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.units, { id: missingUnitIds, language, pageSize: missingUnitIds.length });
    yield put(actions.receiveContentUnits(data.content_units));
  }
}

export function* fetchMissingCollections(uids) {
  const missingCollectionIds = yield select(state => uids.filter(uid => !mdbSelectors.getCollectionById(state.mdb, uid)));

  if (missingCollectionIds.length > 0) {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collections, {
      id: missingCollectionIds, language, pageSize: missingCollectionIds.length
    });
    yield put(actions.receiveCollections(data.collections));
  }
}

function* watchFetchUnit() {
  yield takeEvery(types.FETCH_UNIT, fetchUnit);
}

function* watchFetchUnitsByIDs() {
  yield takeEvery(types.FETCH_UNITS_BY_IDS, fetchUnitsByIDs);
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

function* watchFetchWindow() {
  yield takeEvery(types.FETCH_WINDOW, fetchWindow);
}

function* watchFetchDatepickerCO() {
  yield takeEvery(types.FETCH_DATEPICKER_CO, fetchDatepickerCO);
}

function* watchCountCU() {
  yield takeEvery(types.COUNT_CU, countCU);
}

function* watchCreateLabel() {
  yield takeEvery(types.CREATE_LABEL, createLabel);
}

function* watchFetchLabels() {
  yield takeEvery(types.FETCH_LABELS, fetchLabels);
}

function* watchFetchCollections() {
  yield takeEvery(types.FETCH_LABELS, fetchLabels);
}

export const sagas = [watchFetchUnit, watchFetchUnitsByIDs, watchFetchCollection, watchFetchLatestLesson, watchFetchSQData, watchFetchWindow, watchFetchDatepickerCO, watchCountCU, watchCreateLabel, watchFetchLabels];

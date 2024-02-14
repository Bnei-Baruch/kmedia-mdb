import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_DAILY_LESSON, CT_SPECIAL_LESSON, MY_NAMESPACE_HISTORY } from '../helpers/consts';
import { selectors as authSelectors } from '../redux/modules/auth';
import { actions as mdbActions, selectors as mdbSelectors, types } from '../redux/modules/mdb';
import { actions as publications } from '../redux/modules/publications';
import { actions as sources } from '../redux/modules/sources';
import { actions as tags } from '../redux/modules/tags';
import { fetch as fetchMy } from './my';
import { settingsGetContentLanguagesSelector, settingsGetUILangSelector } from '../redux/selectors';

export function* fetchUnit(action) {
  const id = action.payload;
  try {
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);

    const result = yield call(Api.unit, {
      id,
      ui_language: uiLang,
      content_languages: contentLanguages,
      with_derivations: true
    });

    const { data, status, statusText } = result;
    if (status >= 400) {
      const err = `${status} ${statusText}`;
      yield put(mdbActions.fetchUnitFailure({ id, err }));
    } else {
      yield put(mdbActions.fetchUnitSuccess({ id, data }));
    }
  } catch (err) {
    yield put(mdbActions.fetchUnitFailure({ id, err }));
  }
}

export function* fetchUnitsByIDs(action) {
  const { id } = action.payload;
  try {
    const uiLang                       = yield select(settingsGetUILangSelector);
    const contentLanguages             = yield select(settingsGetContentLanguagesSelector);
    const result                       = yield call(Api.units, {
      ...action.payload,
      ui_language: uiLang,
      content_languages: contentLanguages,
      page_size: id.length
    });
    const { data, status, statusText } = result;
    if (status >= 400) {
      const err = `${status} ${statusText}`;
      yield put(mdbActions.fetchUnitsByIDsFailure({ id, err }));
    } else {
      yield put(mdbActions.fetchUnitsByIDsSuccess({ data: data.content_units }));
    }
  } catch (err) {
    yield put(mdbActions.fetchUnitsByIDsFailure({ id, err }));
  }
}

export function* fetchCollectionsByIDs(action) {
  const { id } = action.payload;
  try {
    const uiLang                       = yield select(settingsGetUILangSelector);
    const contentLanguages             = yield select(settingsGetContentLanguagesSelector);
    const result                       = yield call(Api.collections, {
      ...action.payload,
      ui_language: uiLang,
      content_languages: contentLanguages,
      page_size: id.length
    });
    const { data, status, statusText } = result;
    if (status >= 400) {
      const err = `${status} ${statusText}`;
      yield put(mdbActions.fetchCollectionsByIDsFailure({ id, err }));
    } else {
      yield put(mdbActions.receiveCollections(data.collections));
    }
  } catch (err) {
    yield put(mdbActions.fetchCollectionsByIDsFailure({ id, err }));
  }
}

export function* fetchCollection(action) {
  const id = action.payload;
  try {
    const uiLang                       = yield select(settingsGetUILangSelector);
    const contentLanguages             = yield select(settingsGetContentLanguagesSelector);
    const result                       = yield call(Api.collection, {
      id,
      ui_language: uiLang,
      content_languages: contentLanguages
    });
    const { data, status, statusText } = result;
    if (status >= 400) {
      const err = `${status} ${statusText}`;
      yield put(mdbActions.fetchCollectionFailure({ id, err }));
    } else {
      yield put(mdbActions.fetchCollectionSuccess({ id, data }));
    }
  } catch (err) {
    yield put(mdbActions.fetchCollectionFailure({ id, err }));
  }
}

export function* fetchWindow(action) {
  const { id, ...payload } = action.payload;
  try {
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const args             = {
      ...payload,
      ui_language: uiLang,
      content_languages: contentLanguages,
      content_type: [CT_DAILY_LESSON, CT_SPECIAL_LESSON],
      with_units: true
    };

    const result                       = yield call(Api.collections, args);
    const { data, status, statusText } = result;
    if (status >= 400) {
      const err = `${status} ${statusText}`;
      yield put(mdbActions.fetchWindowFailure({ id, err }));
    } else {
      yield put(mdbActions.fetchWindowSuccess({ id, data }));
    }
  } catch (err) {
    yield put(mdbActions.fetchWindowFailure({ id, err }));
  }
}

export function* fetchDatepickerCO(action) {
  try {
    const uiLang                       = yield select(settingsGetUILangSelector);
    const contentLanguages             = yield select(settingsGetContentLanguagesSelector);
    const args                         = {
      ...action.payload,
      ui_language: uiLang,
      content_languages: contentLanguages,
      content_type: [CT_DAILY_LESSON, CT_SPECIAL_LESSON],
      with_units: true
    };
    const result                       = yield call(Api.collections, args);
    const { data, status, statusText } = result;
    if (status >= 400) {
      const err = `${status} ${statusText}`;
      yield put(mdbActions.fetchDatepickerCOFailure(err));
    } else {
      yield put(mdbActions.fetchDatepickerCOSuccess({ data }));
    }
  } catch (err) {
    yield put(mdbActions.fetchDatepickerCOFailure(err));
  }
}

export function* fetchLatestLesson() {
  try {
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const { data }         = yield call(Api.latestLesson, {
      ui_language: uiLang,
      content_languages: contentLanguages
    });
    const cu_uids          = data.content_units.map(cu => cu.id);
    yield fetchMy({ payload: { namespace: MY_NAMESPACE_HISTORY, cu_uids, page_size: cu_uids.length } });
    yield put(mdbActions.fetchLatestLessonSuccess({ id: cu_uids, data }));
  } catch (err) {
    yield put(mdbActions.fetchLatestLessonFailure(err));
  }
}

export function* fetchSQData() {
  try {
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const { data }         = yield call(Api.sqdata, {
      ui_language: uiLang,
      content_languages: contentLanguages
    });
    yield put(sources.receiveSources({ sources: data.sources, uiLang }));
    yield put(tags.receiveTags(data.tags));
    yield put(publications.receivePublishers(data.publishers));
    yield put(mdbActions.receivePersons(data.persons));
    yield put(mdbActions.fetchSQDataSuccess());
  } catch (err) {
    yield put(mdbActions.fetchSQDataFailure(err));
  }
}

export function* countCU(action) {
  const { params, namespace } = action.payload;
  try {
    const { data: { total } } = yield call(Api.countCU, params);
    yield put(mdbActions.countCUSuccess({ namespace, total }));
  } catch (err) {
    yield put(mdbActions.countCUFailure(err));
  }
}

function* createLabel(action) {
  try {
    const token = yield select(state => authSelectors.getToken(state.auth));
    if (!token) new Error('token is required');

    const { data: { uid } } = yield call(Api.mdbCreateLabel, action.payload, token);

    const uiLang               = yield select(settingsGetUILangSelector);
    const contentLanguages     = yield select(settingsGetContentLanguagesSelector);
    const { data: { labels } } = yield call(Api.labels, {
      id: uid,
      ui_language: uiLang,
      content_languages: contentLanguages
    });
    yield put(mdbActions.receiveLabels(labels));
  } catch (err) {
    console.log(err);
  }
}

export function* fetchLabels(action) {
  try {
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const params           = {
      ...action.payload,
      ui_language: uiLang,
      content_languages: contentLanguages
    };
    const { data }         = yield call(Api.labels, params);
    yield put(mdbActions.receiveLabels(data.labels));
    yield put(mdbActions.fetchLabelsSuccess(data));
  } catch (err) {
    console.error('fetchLabels errors', err);
  }
}

export function* fetchMissingUnits(uids) {
  const missingUnitIds = yield select(state => uids.filter(uid => !mdbSelectors.getUnitById(state.mdb, uid)));

  if (missingUnitIds.length > 0) {
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const { data }         = yield call(Api.units, {
      id: missingUnitIds,
      ui_language: uiLang,
      content_languages: contentLanguages,
      pageSize: missingUnitIds.length
    });
    yield put(mdbActions.receiveContentUnits(data.content_units));
  }
}

export function* fetchMissingCollections(uids) {
  const missingCollectionIds = yield select(state => uids.filter(uid => !mdbSelectors.getCollectionById(state.mdb, uid)));

  if (missingCollectionIds.length > 0) {
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const { data }         = yield call(Api.collections, {
      id: missingCollectionIds,
      ui_language: uiLang,
      content_languages: contentLanguages,
      pageSize: missingCollectionIds.length
    });
    yield put(mdbActions.receiveCollections(data.collections));
  }
}

function* watchFetchUnit() {
  yield takeEvery(types['mdb/fetchUnit'], fetchUnit);
}

function* watchFetchUnitsByIDs() {
  yield takeEvery(types['mdb/fetchUnitsByIDs'], fetchUnitsByIDs);
}

function* watchFetchCollection() {
  yield takeEvery(types['mdb/fetchCollection'], fetchCollection);
}

function* watchFetchLatestLesson() {
  yield takeEvery(types['mdb/fetchLatestLesson'], fetchLatestLesson);
}

function* watchFetchSQData() {
  yield takeLatest(types['mdb/fetchSQData'], fetchSQData);
}

function* watchFetchWindow() {
  yield takeEvery(types['mdb/fetchWindow'], fetchWindow);
}

function* watchFetchDatepickerCO() {
  yield takeEvery(types['mdb/fetchDatepickerCO'], fetchDatepickerCO);
}

function* watchCountCU() {
  yield takeEvery(types['mdb/countCU'], countCU);
}

function* watchCreateLabel() {
  yield takeEvery(types['mdb/createLabel'], createLabel);
}

function* watchFetchLabels() {
  yield takeEvery(types['mdb/fetchLabels'], fetchLabels);
}

export const sagas = [watchFetchUnit, watchFetchUnitsByIDs, watchFetchCollection, watchFetchLatestLesson, watchFetchSQData, watchFetchWindow, watchFetchDatepickerCO, watchCountCU, watchCreateLabel, watchFetchLabels];

import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../../../../src/helpers/Api';
import { CT_DAILY_LESSON, CT_SPECIAL_LESSON, MY_NAMESPACE_HISTORY, MAX_PAGE_SIZE } from '@/src/helpers/consts';
import { selectors as authSelectors } from '../authSlice/authSlice';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { actions, selectors as mdbSelectors, types, mdbSlice } from './mdbSlice';
import { publicationsSlice } from '../publicationsSlice';
import { sourcesSlice } from '../sourcesSlice/sourcesSlice';
import { tagsSlice } from '../tagsSlice/tagsSlice';
import { fetch as fetchMy } from '../mySlice/thunks';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUnit = createAsyncThunk(
  'mdb/fetchUnit',
  async (payload, thunkAPI) => {
    const state            = thunkAPI.getState();
    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const id       = payload;
    const args     = { id, ui_language: uiLang, content_languages: contentLanguages, with_files: true };
    const { data } = await Api.unit(args);

    return { id, data };
  }
);

export const fetchUnitsByIDs = createAsyncThunk(
  'mdb/fetchUnitsByIDs',
  async (payload, thunkAPI) => {
    const state            = thunkAPI.getState();
    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const { id }   = payload;
    const args     = {
      ...payload,
      ui_language: uiLang,
      content_languages: contentLanguages,
      page_size: id.length,
    };
    const { data } = await Api.units(args);

    return data;
  }
);

export const fetchCollections = createAsyncThunk(
  'mdb/fetchCollectionsByIDs',
  async (payload, thunkAPI) => {
    const state            = thunkAPI.getState();
    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    let pageSize = payload.pageSize;
    if (!pageSize) {
      pageSize = payload.id ? payload.id.length : MAX_PAGE_SIZE;
    }
    const args = {
      ...payload,
      ui_language: uiLang,
      content_languages: contentLanguages,
      pageSize
    };

    const { data } = await Api.collections(args);

    return data;
  }
);

export const fetchCollection = createAsyncThunk(
  'mdb/fetchCollection',
  async (payload, thunkAPI) => {
    const state            = thunkAPI.getState();
    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const id       = payload;
    const args     = { id, ui_language: uiLang, content_languages: contentLanguages };
    const { data } = await Api.collections(args);

    return { id, ...data };
  }
);

export const fetchWindow = createAsyncThunk(
  'mdb/fetchWindow',
  async (payload, thunkAPI) => {
    const state            = thunkAPI.getState();
    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const id       = payload;
    const args     = {
      ...payload,
      ui_language: uiLang,
      content_languages: contentLanguages,
      content_type: [CT_DAILY_LESSON, CT_SPECIAL_LESSON],
      with_units: true
    };
    const { data } = await Api.collections(args);

    return { id, data };
  }
);

export const fetchDatepickerCO = createAsyncThunk(
  'mdb/fetchDatepickerCO',
  async (payload, thunkAPI) => {
    const state            = thunkAPI.getState();
    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const args     = {
      ...action.payload,
      ui_language: uiLang,
      content_languages: contentLanguages,
      content_type: [CT_DAILY_LESSON, CT_SPECIAL_LESSON],
      with_units: true
    };
    const { data } = await Api.collections(args);

    return { data };
  }
);

export const fetchLatestLesson = createAsyncThunk(
  'mdb/fetchLatestLesson',
  async (payload, thunkAPI) => {
    const state            = thunkAPI.getState();
    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const args     = { ui_language: uiLang, content_languages: contentLanguages, };
    const { data } = await Api.latestLesson(args);
    const cu_uids  = data.content_units.map(cu => cu.id);
    fetchMy({ payload: { namespace: MY_NAMESPACE_HISTORY, cu_uids, page_size: cu_uids.length } });

    return { data };
  }
);

export const fetchSQData = createAsyncThunk(
  'mdb/fetchSQData',
  async (params, thunkAPI) => {
    const state = thunkAPI.getState();

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const { data } = await Api.sqdata({ ui_language: uiLang, content_languages: contentLanguages });

    thunkAPI.dispatch(mdbSlice.actions.receivePersons(data.persons));
    thunkAPI.dispatch(tagsSlice.actions.receiveTags(data.tags));
    thunkAPI.dispatch(publicationsSlice.actions.receivePublishers(data.publishers));
    return { sources: data.sources, uiLang };
  }
);

export const countCU = createAsyncThunk(
  'mdb/countCU',
  async (payload) => {
    const { params, namespace } = payload;
    const { data: { total } }   = await Api.countCU(params);

    return { namespace, total };
  }
);

export const createLabel = createAsyncThunk(
  'mdb/createLabel',
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();

    const token = authSelectors.getToken(state.auth);
    if (!token) new Error('token is required');

    const { data: { uid } }    = await Api.mdbCreateLabel(payload, token);
    const uiLang               = settings.getUILang(state.settings);
    const contentLanguages     = settings.getContentLanguages(state.settings);
    const args                 = { id: uid, ui_language: uiLang, content_languages: contentLanguages };
    const { data: { labels } } = await Api.labels(args);
    mdbSlice.actions.receiveLabels(labels);
  }
);

export const fetchLabels = createAsyncThunk(
  'mdb/fetchLabels',
  async (payload, thunkAPI) => {
    const state            = thunkAPI.getState();
    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const args     = {
      ...payload,
      ui_language: uiLang,
      content_languages: contentLanguages,
    };
    const { data } = await Api.labels(args);
    mdbSlice.actions.receiveLabels(labels);
    return { ...data };
  }
);

export function* fetchMissingUnits(uids) {
  const missingUnitIds = yield select(state => uids.filter(uid => !mdbSelectors.getUnitById(state.mdb, uid)));

  if (missingUnitIds.length > 0) {
    const uiLang           = yield select(state => settings.getUILang(state.settings));
    const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));
    const { data }         = yield call(Api.units, {
      id: missingUnitIds,
      ui_language: uiLang,
      content_languages: contentLanguages,
      pageSize: missingUnitIds.length,
    });
    yield put(actions.receiveContentUnits(data.content_units));
  }
}

export function* fetchMissingCollections(uids) {
  const missingCollectionIds = yield select(state => uids.filter(uid => !mdbSelectors.getCollectionById(state.mdb, uid)));

  if (missingCollectionIds.length > 0) {
    const uiLang           = yield select(state => settings.getUILang(state.settings));
    const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));
    const { data }         = yield call(Api.collections, {
      id: missingCollectionIds,
      ui_language: uiLang,
      content_languages: contentLanguages,
      pageSize: missingCollectionIds.length,
    });
    yield put(actions.receiveCollections(data.collections));
  }
}

/*

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

export const sagas = [watchFetchUnit, watchFetchUnitsByIDs, watchFetchCollection, watchFetchLatestLesson, watchFetchSQData, watchFetchWindow, watchFetchDatepickerCO, watchCountCU, watchCreateLabel, watchFetchLabels];
*/

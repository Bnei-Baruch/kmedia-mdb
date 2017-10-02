import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { EVENT_TYPES } from '../helpers/consts';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/events';
import { actions as mdbActions } from '../redux/modules/mdb';

function* fetchAllEvents(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const resp     = yield call(Api.collections, {
      ...action.payload,
      contentTypes: EVENT_TYPES,
      language,
      pageNo: 1,
      pageSize: 1000, // NOTE: we need to get all events, and the endpoint lets us fetch only with pagination,
      with_units: false,
    });
    yield put(mdbActions.receiveCollections(resp.collections));
    yield put(actions.fetchAllEventsSuccess(resp));
  } catch (err) {
    yield put(actions.fetchAllEventsFailure(err));
  }
}

function* fetchEventItem(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const response = yield call(Api.unit, { id: action.payload, language });
    yield put(mdbActions.receiveContentUnits([response]));
    yield put(actions.fetchEventItemSuccess(action.payload));
  } catch (err) {
    yield put(actions.fetchEventItemFailure(action.payload, err));
  }
}

function* fetchFullEvent(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const response = yield call(Api.collection, { id: action.payload, language });
    yield put(mdbActions.receiveCollections([response]));
    yield put(actions.fetchFullEventSuccess(action.payload));
  } catch (err) {
    yield put(actions.fetchFullEventFailure(action.payload, err));
  }
}

function* watchFetchAllEvents() {
  yield takeLatest(types.FETCH_ALL_EVENTS, fetchAllEvents);
}

function* watchFetchEventItem() {
  yield takeEvery(types.FETCH_EVENT_ITEM, fetchEventItem);
}

function* watchFetchFullEvent() {
  yield takeLatest(types.FETCH_FULL_EVENT, fetchFullEvent);
}

export const sagas = [
  watchFetchAllEvents,
  watchFetchEventItem,
  watchFetchFullEvent,
];

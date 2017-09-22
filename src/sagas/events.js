import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { updateQuery } from './helpers/url';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/events';
import { actions as mdbActions } from '../redux/modules/mdb';

function* fetchEventsList(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const resp     = yield call(Api.collections, { ...action.payload, language });

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

function* updatePageInQuery(action) {
  const page = action.payload > 1 ? action.payload : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

function* watchFetchList() {
  yield takeLatest(types.FETCH_LIST, fetchEventsList);
}

function* watchfetchEventItem() {
  yield takeEvery(types.FETCH_EVENT_ITEM, fetchEventItem);
}

function* watchFetchFullEvent() {
  yield takeLatest(types.FETCH_FULL_EVENT, fetchFullEvent);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [
  watchFetchList,
  watchfetchEventItem,
  watchFetchFullEvent,
  watchSetPage,
];

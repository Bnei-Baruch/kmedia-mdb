import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { EVENT_TYPES } from '../helpers/consts';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/events';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { selectors as listsSelectors } from '../redux/modules/lists';
import { filtersTransformer } from '../filters';
import { updateQuery } from './helpers/url';

function* fetchAllEvents(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collections, {
      ...action.payload,
      contentTypes: EVENT_TYPES,
      language,
      pageNo: 1,
      pageSize: 1000, // NOTE: we need to get all events, and the endpoint lets us fetch only with pagination,
      with_units: false,
    });
    yield put(mdbActions.receiveCollections(data.collections));
    yield put(actions.fetchAllEventsSuccess(data));
  } catch (err) {
    yield put(actions.fetchAllEventsFailure(err));
  }
}

function* fetchEventItem(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.unit, { id: action.payload, language });
    yield put(mdbActions.receiveContentUnits([data]));
    yield put(actions.fetchEventItemSuccess(action.payload));
  } catch (err) {
    yield put(actions.fetchEventItemFailure(action.payload, err));
  }
}

function* fetchFullEvent(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collection, { id: action.payload, language });
    yield put(mdbActions.receiveCollections([data]));
    yield put(actions.fetchFullEventSuccess(action.payload));
  } catch (err) {
    yield put(actions.fetchFullEventFailure(action.payload, err));
  }
}

function* setTab(action) {
  // we have to replace url completely...

  const tab       = action.payload;
  const namespace = `events-${tab}`;
  const filters   = yield select(state => filterSelectors.getFilters(state.filters, namespace));
  const lists     = yield select(state => listsSelectors.getNamespaceState(state.lists, namespace));
  const q         = {
    page: lists.pageNo,
    ...filtersTransformer.toQueryParams(filters),
  };

  yield* updateQuery(query => {
    const x = Object.assign(query, q);
    if (x.page === 1) {
      delete x.page;
    }
    return x;
  });
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

function* watchSetTab() {
  yield takeLatest(types.SET_TAB, setTab);
}

export const sagas = [
  watchFetchAllEvents,
  watchFetchEventItem,
  watchFetchFullEvent,
  watchSetTab,
];

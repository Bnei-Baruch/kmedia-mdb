import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { EVENT_TYPES } from '../helpers/consts';
import { setTab } from './helpers/url';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/events';
import { actions as mdbActions } from '../redux/modules/mdb';

export function* fetchAllEvents(action) {
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

function* watchFetchAllEvents() {
  yield takeLatest(types.FETCH_ALL_EVENTS, fetchAllEvents);
}

function* watchSetTab() {
  yield takeLatest(types.SET_TAB, setTab);
}

export const sagas = [
  watchFetchAllEvents,
  watchSetTab,
];

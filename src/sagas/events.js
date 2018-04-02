import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { EVENT_TYPES } from '../helpers/consts';
import { updateQuery } from './helpers/url';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/events';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { selectors as listsSelectors } from '../redux/modules/lists';
import { filtersTransformer } from '../filters';

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

function* watchSetTab() {
  yield takeLatest(types.SET_TAB, setTab);
}

export const sagas = [
  watchFetchAllEvents,
  watchSetTab,
];

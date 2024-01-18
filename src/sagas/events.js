import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { EVENT_TYPES } from '../helpers/consts';
import { setTab } from './helpers/url';
import { actions, types } from '../redux/modules/events';
import { actions as mdbActions } from '../redux/modules/mdb';
import { settingsGetContentLanguagesSelector, settingsGetUILangSelector } from '../redux/selectors';

export function* fetchAllEvents(action) {
  try {
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);

    const { data } = yield call(Api.collections, {
      ...action.payload,
      contentTypes     : EVENT_TYPES,
      ui_language      : uiLang,
      content_languages: contentLanguages,
      pageNo           : 1,
      pageSize         : 1000, // NOTE: we need to get all events, and the endpoint lets us fetch only with pagination,
      with_units       : false
    });
    yield put(mdbActions.receiveCollections(data.collections));
    yield put(actions.fetchAllEventsSuccess(data));
  } catch (err) {
    yield put(actions.fetchAllEventsFailure(err));
  }
}

function* watchFetchAllEvents() {
  yield takeLatest(types['events/fetchAllEvents'], fetchAllEvents);
}

function* watchSetTab() {
  yield takeLatest(types['events/setTab'], setTab);
}

export const sagas = [
  watchFetchAllEvents,
  watchSetTab
];

import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/my';
import Api from '../helpers/Api';
import { selectors as authSelectors } from '../redux/modules/auth';
import { actions as mdbActions } from '../redux/modules/mdb';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_LIKES,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '../helpers/consts';
import { updateQuery } from './helpers/url';

function* updatePageInQuery(action) {
  const { pageNo } = action.payload;
  const page       = pageNo > 1 ? pageNo : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

function* fetch(action) {
  const { namespace, ...params } = action.payload;

  const token = yield select(state => authSelectors.getToken(state.auth));
  try {
    const { data } = yield call(Api.my, namespace, params, token);

    let cu_uids       = [];
    let co_uids       = [];
    let content_types = [];

    switch (namespace) {
    case MY_NAMESPACE_HISTORY:
    case MY_NAMESPACE_LIKES:
      cu_uids = data.items?.map(x => x.content_unit_uid) || [];
      break;
    case MY_NAMESPACE_PLAYLISTS:
      cu_uids = data.items?.filter(p => p.playlist_items?.[0]).map(p => p.playlist_items[0].content_unit_uid) || [];
    case MY_NAMESPACE_SUBSCRIPTIONS:
      co_uids       = data.items?.filter(s => s.collection_uid).map(s => s.collection_uid) || [];
      content_types = data.items?.filter(s => s.content_type).map(s => s.content_type) || [];
      break;
    }

    if (cu_uids.length > 0) {
      const { data: { content_units } } = yield call(Api.units, { id: cu_uids, pageSize: cu_uids.length });
      yield put(mdbActions.receiveContentUnits(content_units));
    }
    yield put(actions.fetchSuccess({ namespace, ...data }));
  } catch (err) {
    yield put(actions.fetchFailure({ namespace, ...err }));
  }
}

function* add(action) {
  const token                    = yield select(state => authSelectors.getToken(state.auth));
  const { namespace, ...params } = action.payload;
  try {
    const { data } = yield call(Api.my, namespace, params, token, 'POST');
    yield put(actions.addSuccess({ namespace, items: data }));
  } catch (err) {
  }
}

function* remove(action) {
  const token                    = yield select(state => authSelectors.getToken(state.auth));
  const { namespace, ...params } = action.payload;
  try {
    const { data } = yield call(Api.my, namespace, params, token, 'DELETE');
    yield put(actions.removeSuccess({ namespace, ...params }));
  } catch (err) {

  }
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

function* watchFetch() {
  yield takeEvery(types.FETCH, fetch);
}

function* watchAdd() {
  yield takeEvery(types.ADD, add);
}

function* watchRemove() {
  yield takeEvery(types.REMOVE, remove);
}

export const sagas = [
  watchSetPage,
  watchFetch,
  watchAdd,
  watchRemove,
];

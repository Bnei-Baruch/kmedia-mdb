import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/my';
import Api from '../helpers/Api';
import { selectors as authSelectors } from '../redux/modules/auth';
import { actions as mdbActions } from '../redux/modules/mdb';
import { actions as recommendedActions } from '../redux/modules/recommended';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_LIKES,
  MY_NAMESPACE_PLAYLIST_BY_ID,
  MY_NAMESPACE_PLAYLIST_ITEMS,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '../helpers/consts';
import { updateQuery } from './helpers/url';
import { selectors as settings } from '../redux/modules/settings';

function* updatePageInQuery(action) {
  const { pageNo } = action.payload;
  const page       = pageNo > 1 ? pageNo : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

function* fetch(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;
  // eslint-disable-next-line prefer-const
  let { namespace, with_files = false, ...params } = action.payload;

  const language = yield select(state => settings.getLanguage(state.settings));
  try {
    const { data } = yield call(Api.my, namespace, params, token);

    let cu_uids = [];
    let co_uids = [];

    switch (namespace) {
      case MY_NAMESPACE_HISTORY:
      case MY_NAMESPACE_LIKES:
        cu_uids = data.items?.map(x => x.content_unit_uid) || [];
        break;
      case MY_NAMESPACE_PLAYLIST_ITEMS:
        cu_uids    = data.items?.map(x => x.content_unit_uid) || [];
        with_files = true;
        break;
      case MY_NAMESPACE_PLAYLISTS:
        cu_uids = data.items?.filter(p => p.playlist_items).reduce((acc, p) => acc.concat(p.playlist_items.flatMap(x => x.content_unit_uid)), []);
        break;
      case MY_NAMESPACE_SUBSCRIPTIONS:
        co_uids = data.items?.filter(s => s.collection_uid).map(s => s.collection_uid) || [];
        break;
      default:
    }

    if (cu_uids.length > 0) {
      const { data: { content_units } } = yield call(Api.units, {
        id: cu_uids,
        pageSize: cu_uids.length,
        with_files,
        language
      });
      yield put(mdbActions.receiveContentUnits(content_units));
    }

    if (co_uids.length > 0) {
      const { data: { collections } } = yield call(Api.collections, {
        id: co_uids,
        pageSize: co_uids.length,
        language
      });
      yield put(mdbActions.receiveCollections(collections));
    }

    if (action.type === types.FETCH_BY_CU) {
      yield put(actions.fetchByCUSuccess({ namespace, ...data, uids: params.uids }));
    } else {
      yield put(actions.fetchSuccess({ namespace, ...data }));
    }

    try {
      const { data: viewData } = yield call(Api.views, cu_uids);
      const views              = cu_uids.reduce((acc, uid, i) => {
        acc[uid] = viewData.views[i];
        return acc;
      }, {});
      yield put(recommendedActions.receiveViews(views));
    } catch (err) {
      console.error('error on recommendation service', err);
    }
  } catch (err) {
    yield put(actions.fetchFailure({ namespace, ...err }));
  }
}

function* fetchById(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;
  const { namespace, ...params } = action.payload;
  if (!params?.id) return;
  const language = yield select(state => settings.getLanguage(state.settings));
  try {
    const { data } = yield call(Api.my, namespace, params, token);

    let cu_uids = [];
    switch (namespace) {
      case MY_NAMESPACE_PLAYLIST_BY_ID:
        cu_uids = data.playlist_items?.map(x => x.content_unit_uid) || [];
        break;
      default:
    }

    if (cu_uids.length > 0) {
      const { data: { content_units } } = yield call(Api.units, {
        id: cu_uids,
        pageSize: cu_uids.length,
        with_files: true,
        language,
      });
      yield put(mdbActions.receiveContentUnits(content_units));
    }

    yield put(actions.fetchSuccess({ namespace, items: [data] }));
  } catch (err) {
    yield put(actions.fetchFailure({ namespace, ...err }));
  }
}

function* add(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;
  const { namespace, ...params } = action.payload;
  try {
    const { data } = yield call(Api.my, namespace, params, token, 'POST');
    yield put(actions.addSuccess({ namespace, items: data }));
  } catch (err) {
    console.log(err);
  }
}

function* edit(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;
  const { namespace, ...params } = action.payload;
  try {
    const { data } = yield call(Api.my, namespace, params, token, 'PATCH');
    yield put(actions.editSuccess({ namespace, item: data }));
  } catch (err) {
    console.log(err);
  }
}

function* remove(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;
  const { namespace, ...params } = action.payload;
  try {
    yield call(Api.my, namespace, params, token, 'DELETE');
    yield put(actions.removeSuccess({ namespace, ...params }));
  } catch (err) {
    console.log(err);
  }
}

function* likeCount(action) {
  try {
    const { data } = yield call(Api.likeCount, action.payload);
    yield put(actions.likeCountSuccess(data));
  } catch (err) {
    console.log(err);
  }
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

function* watchFetch() {
  yield takeEvery(types.FETCH, fetch);
  yield takeEvery(types.FETCH_BY_CU, fetch);
}

function* watchFetchById() {
  yield takeEvery(types.FETCH_BY_ID, fetchById);
}

function* watchAdd() {
  yield takeEvery(types.ADD, add);
}

function* watchEdit() {
  yield takeEvery(types.EDIT, edit);
}

function* watchRemove() {
  yield takeEvery(types.REMOVE, remove);
}

function* watchLikeCount() {
  yield takeEvery(types.LIKE_COUNT, likeCount);
}

export const sagas = [
  watchSetPage,
  watchFetch,
  watchFetchById,
  watchAdd,
  watchEdit,
  watchRemove,
  watchLikeCount,
];

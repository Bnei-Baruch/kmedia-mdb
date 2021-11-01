import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/my';
import Api from '../helpers/Api';
import { selectors as authSelectors } from '../redux/modules/auth';
import { actions as mdbActions, selectors as mdbSelectors } from '../redux/modules/mdb';
import { actions as recommendedActions } from '../redux/modules/recommended';
import {
  IsCollectionContentType,
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_PLAYLISTS, MY_NAMESPACE_REACTIONS,
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
  let { namespace, with_files = false, addToList = true, ...params } = action.payload;

  const language = yield select(state => settings.getLanguage(state.settings));
  try {
    const { data } = yield call(Api.my, namespace, params, token);
    if (!data?.items) {
      yield put(actions.fetchSuccess({ namespace, items: [] }));
      return;
    }

    let cu_uids = [];
    let co_uids = [];

    switch (namespace) {
      case MY_NAMESPACE_HISTORY:
        cu_uids = data.items?.map(x => x.content_unit_uid) || [];
        break;
      case MY_NAMESPACE_REACTIONS:
        cu_uids = data.items?.filter(x => !IsCollectionContentType(x.subject_type)).map(x => x.subject_uid) || [];
        break;
      case MY_NAMESPACE_PLAYLISTS:
        if (data.items) {
          cu_uids = data.items.filter(p => p.items)
            .reduce((acc, p) => acc.concat(p.items.flatMap(x => x.content_unit_uid)), []);
        }

        cu_uids.concat(data.items.map(x => x.content_unit_uid).filter(x => !!x));
        break;
      case MY_NAMESPACE_SUBSCRIPTIONS:
        cu_uids = data.items?.map(x => x.content_unit_uid) || [];
        co_uids = data.items?.filter(s => s.collection_uid).map(s => s.collection_uid) || [];
        break;
      default:
    }

    cu_uids = yield select(state => mdbSelectors.skipFetchedCU(state.mdb, cu_uids, with_files));
    co_uids = yield select(state => mdbSelectors.skipFetchedCO(state.mdb, co_uids));
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

    yield put(actions.fetchSuccess({ namespace, addToList, ...data }));

    try {
      const { data: viewData } = yield call(Api.views, cu_uids);
      const views              = cu_uids.reduce((acc, uid, i) => {
        acc[uid] = viewData.views[i];
        return acc;
      }, {});
      yield put(recommendedActions.receiveViews(views));
    } catch (err) {
      console.error('error on recommendation service', err);
      yield put(recommendedActions.receiveViews({}));
    }
  } catch (err) {
    yield put(actions.fetchFailure({ namespace, ...err }));
  }
}

function* fetchOne(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;
  const { namespace, ...params } = action.payload;
  if (!params?.id) return;
  const language = yield select(state => settings.getLanguage(state.settings));
  try {
    const { data } = yield call(Api.my, namespace, params, token);

    let cu_uids = [];
    switch (namespace) {
      case MY_NAMESPACE_PLAYLISTS:
        cu_uids = data.items?.map(x => x.content_unit_uid) || [];
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

    yield put(actions.fetchOneSuccess({ namespace, item: data }));
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
    yield put(actions.addSuccess({ namespace, item: data }));
  } catch (err) {
    console.log(err);
  }
}

function* edit(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;
  const { namespace, ...params } = action.payload;
  try {
    const { data } = yield call(Api.my, namespace, params, token, 'PUT');
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
    const { data } = yield call(Api.my, namespace, { ...params }, token, 'DELETE');
    if (namespace === MY_NAMESPACE_PLAYLISTS && params.changeItems) {
      yield put(actions.fetchOneSuccess({ namespace, item: data }));
    } else {
      yield put(actions.removeSuccess({ namespace, item: params }));
    }
  } catch (err) {
    console.log(err);
  }
}

function* reactionsCount(action) {
  try {
    const { data } = yield call(Api.reactionsCount, action.payload);
    yield put(actions.reactionsCountSuccess(data));
  } catch (err) {
    console.log(err);
  }
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

function* watchFetch() {
  yield takeEvery(types.FETCH, fetch);
}

function* watchFetchOne() {
  yield takeEvery(types.FETCH_ONE, fetchOne);
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

function* watchReactionsCount() {
  yield takeEvery(types.REACTION_COUNT, reactionsCount);
}

export const sagas = [
  watchSetPage,
  watchFetch,
  watchFetchOne,
  watchAdd,
  watchEdit,
  watchRemove,
  watchReactionsCount,
];

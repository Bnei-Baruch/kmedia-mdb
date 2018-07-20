import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/blog';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';
import { updateQuery } from './helpers/url';

export function* fetchList(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, 'blog'));
  const params  = filtersTransformer.toApiParams(filters) || {};
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const args     = {
      ...action.payload,
      ...params,
      language,
    };

    const { data } = yield call(Api.posts, args);
    yield put(actions.fetchListSuccess(data));
  } catch (err) {
    yield put(actions.fetchListFailure(err));
  }
}

export function* fetchPost(action) {
  const { blog, id } = action.payload;
  try {
    const { data } = yield call(Api.post, blog, id);
    yield put(actions.fetchPostSuccess(data));
  } catch (err) {
    yield put(actions.fetchPostFailure(err));
  }
}

function* updatePageInQuery(action) {
  const { pageNo } = action.payload;
  const page       = pageNo > 1 ? pageNo : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

function* watchFetchList() {
  yield takeLatest([types.FETCH_LIST], fetchList);
}

function* watchFetchPost() {
  yield takeLatest([types.FETCH_POST], fetchPost);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [
  watchFetchList,
  watchFetchPost,
  watchSetPage,
];

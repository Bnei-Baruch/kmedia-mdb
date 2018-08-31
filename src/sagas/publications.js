import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/publications';
import { filtersTransformer } from '../filters';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { updateQuery } from './helpers/url';

export function* fetchTweets(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, 'publications-twitter'));
  const params  = filtersTransformer.toApiParams(filters) || {};
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const args     = {
      ...action.payload,
      ...params,
      language,
    };

    const { data } = yield call(Api.tweets, args);
    yield put(actions.fetchTweetsSuccess(data));
  } catch (err) {
    yield put(actions.fetchTweetsFailure(err));
  }
}

export function* fetchBlogList(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, 'publications-blog'));
  const params  = filtersTransformer.toApiParams(filters) || {};
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const args     = {
      ...action.payload,
      ...params,
      language,
    };

    const { data } = yield call(Api.posts, args);
    yield put(actions.fetchBlogListSuccess(data));
  } catch (err) {
    yield put(actions.fetchBlogListFailure(err));
  }
}

export function* fetchBlogPost(action) {
  const { blog, id } = action.payload;
  try {
    const { data } = yield call(Api.post, blog, id);
    yield put(actions.fetchBlogPostSuccess(data));
  } catch (err) {
    yield put(actions.fetchBlogPostFailure(err));
  }
}

function* setTab(action) {
  // we have to replace url completely...

  const tab       = action.payload;
  const namespace = `publications-${tab}`;
  const filters   = yield select(state => filterSelectors.getFilters(state.filters, namespace));
  // const lists     = yield select(state => listsSelectors.getNamespaceState(state.lists, namespace));
  const q         = {
    // page: lists.pageNo,
    ...filtersTransformer.toQueryParams(filters),
  };

  yield* updateQuery((query) => {
    const x = Object.assign(query, q);
    if (x.page === 1) {
      delete x.page;
    }
    return x;
  });
}

function* updatePageInQuery(action) {
  const { pageNo } = action.payload;
  const page       = pageNo > 1 ? pageNo : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

function* watchFetchTweets() {
  yield takeLatest([types.FETCH_TWEETS], fetchTweets);
}

function* watchFetchBlogList() {
  yield takeLatest([types.FETCH_BLOG_LIST], fetchBlogList);
}

function* watchFetchBlogPost() {
  yield takeLatest([types.FETCH_BLOG_POST], fetchBlogPost);
}

function* watchSetTab() {
  yield takeLatest(types.SET_TAB, setTab);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [
  watchFetchTweets,
  watchFetchBlogList,
  watchFetchBlogPost,
  watchSetTab,
  watchSetPage,
];

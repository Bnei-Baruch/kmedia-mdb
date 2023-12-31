import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_ARTICLES } from '../helpers/consts';
import { selectors as settings } from '../redux/modules/settings';
import { actions, selectors, types } from '../redux/modules/publications';
import { types as listTypes } from '../redux/modules/lists';
import { filtersTransformer } from '../filters';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { setTab, updateQuery } from './helpers/url';
import { isEmpty } from '../helpers/utils';
import { actions as mbdActions } from '../redux/modules/mdb';

export function* fetchTweets(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, 'publications-twitter'));
  const params  = filtersTransformer.toApiParams(filters) || {};
  try {
    const uiLang           = yield select(state => settings.getUILang(state.settings));
    const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));
    const args             = {
      ...action.payload,
      ...params,
      ui_language      : uiLang,
      content_languages: contentLanguages
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
    const uiLang           = yield select(state => settings.getUILang(state.settings));
    const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));
    const args             = {
      ...action.payload,
      ...params,
      ui_language      : uiLang,
      content_languages: contentLanguages
    };

    const { data } = yield call(Api.posts, args);
    yield put(actions.fetchBlogListSuccess(data));
    yield put(actions.fetchBlogListFailure('err'));
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

function* fetchArticlesList(action) {
  if (action.payload.namespace !== 'publications-articles') {
    return;
  }

  try {
    // fetch once
    const collections = yield select(state => selectors.getCollections(state.publications));
    if (!isEmpty(collections)) {
      return;
    }

    const uiLang           = yield select(state => settings.getUILang(state.settings));
    const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));
    const { data }         = yield call(Api.collections, {
      ui_language      : uiLang,
      content_languages: contentLanguages,
      content_type     : CT_ARTICLES,
      pageNo           : 1,
      pageSize         : 1000,
      with_units       : false
    });

    if (Array.isArray(data.collections)) {
      yield put(mbdActions.receiveCollections(data.collections));
      yield put(actions.fetchCollections(data.collections));
    }
  } catch (err) {
    console.log('fetch lectures error', err);
  }
}

function* updatePageInQuery(action) {
  const { pageNo } = action.payload;
  const page       = pageNo > 1 ? pageNo : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

function* watchFetchArticleList() {
  yield takeLatest(listTypes['lists/fetchList'], fetchArticlesList);
}

function* watchFetchTweets() {
  yield takeLatest(types['publications/fetchTweets'], fetchTweets);
}

function* watchFetchBlogList() {
  yield takeLatest(types['publications/fetchBlogList'], fetchBlogList);
}

function* watchFetchBlogPost() {
  yield takeLatest(types['publications/fetchBlogPost'], fetchBlogPost);
}

function* watchSetTab() {
  yield takeLatest(types['publications/setTab'], setTab);
}

function* watchSetPage() {
  yield takeLatest(types['publications/setPage'], updatePageInQuery);
}

export const sagas = [
  watchFetchArticleList,
  watchFetchTweets,
  watchFetchBlogList,
  watchFetchBlogPost,
  watchSetTab,
  watchSetPage
];

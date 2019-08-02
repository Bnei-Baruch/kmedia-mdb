import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { getQuery, updateQuery as urlUpdateQuery } from './helpers/url';
import { GenerateSearchId } from '../helpers/search';
import { actions, selectors, types } from '../redux/modules/search';
import { selectors as settings } from '../redux/modules/settings';
import { actions as mdbActions } from '../redux/modules/mdb';
import { actions as postsActions } from '../redux/modules/publications';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';

// import { BLOGS } from '../helpers/consts';

function* autocomplete(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.autocomplete, { q: action.payload, language });
    yield put(actions.autocompleteSuccess(data));
  } catch (err) {
    yield put(actions.autocompleteFailure(err));
  }
}

function getIdsForFetch(hits, type) {
  return hits.reduce((acc, val) => {
    if (val._source.result_type === type) {
      return acc.concat(val._source.mdb_uid);
    }
    return acc;
  }, []);
}

export function* search(action) {
  try {
    yield* urlUpdateQuery(query => Object.assign(query, { q: action.payload.q }));

    const language = yield select(state => settings.getLanguage(state.settings));
    const sortBy   = yield select(state => selectors.getSortBy(state.search));
    const suggest  = yield select(state => selectors.getSuggest(state.search));
    const deb      = yield select(state => selectors.getDeb(state.search));

    // Prepare filters values.
    const filters         = yield select(state => filterSelectors.getFilters(state.filters, 'search'));
    const params          = filtersTransformer.toApiParams(filters);
    const filterKeyValues = Object.entries(params).map(([v, k]) => `${v}:${k}`).join(' ');
    const filterParams    = filterKeyValues ? ` ${filterKeyValues}` : '';

    const q = action.payload.q.trim() ? `${action.payload.q.trim()}${filterParams}` : filterParams;
    if (!q) {
      // If no query nor filters, silently fail the request, don't sent request to backend.
      yield put(actions.searchFailure(null));
      return;
    }
    const searchId = GenerateSearchId();

    const { data } = yield call(Api.search, {
      ...action.payload,
      q,
      sortBy,
      language,
      deb,
      suggest: suggest === q ? '' : suggest,
      searchId
    });

    data.search_result.searchId = searchId;

    if (Array.isArray(data.search_result.hits.hits) && data.search_result.hits.hits.length > 0) {
      // TODO edo: optimize data fetching
      // Server should return associated items (collections, units, posts...) together with search results
      // hmm, relay..., hmm ?
      const cIDsToFetch    = getIdsForFetch(data.search_result.hits.hits, 'collections');
      const cuIDsToFetch   = getIdsForFetch(data.search_result.hits.hits, 'units');
      const postIDsToFetch = getIdsForFetch(data.search_result.hits.hits, 'posts');
      const twitterIDsToFetch = data.search_result.hits.hits
        .filter(h=>h._type === 'tweets_many')
        .flatMap(h=>h._source)
        .map(s=>s._source.mdb_uid);

      if (cuIDsToFetch.length === 0 && cIDsToFetch.length === 0 && postIDsToFetch.length === 0 && twitterIDsToFetch.length === 0) {
        yield put(actions.searchSuccess(data));
        return;
      }

      const lang     = yield select(state => settings.getLanguage(state.settings));
      const requests = [];
      if (cuIDsToFetch.length > 0) {
        requests.push(call(Api.units, { id: cuIDsToFetch, pageSize: cuIDsToFetch.length, language: lang, with_files: true }));
      }
      if (cIDsToFetch.length > 0) {
        requests.push(call(Api.collections, { id: cIDsToFetch, pageSize: cIDsToFetch.length, language: lang }));
      }
      if (postIDsToFetch.length > 0) {
        requests.push(call(Api.posts, { id: postIDsToFetch, pageSize: postIDsToFetch.length, language: lang }));
      }

      if(twitterIDsToFetch.length > 0) {
        requests.push( call(Api.tweets, { id: twitterIDsToFetch, pageSize: twitterIDsToFetch.length, language: lang  }));
      }


      const responses = yield all(requests);
      if (cuIDsToFetch.length > 0) {
        const respCU = responses.shift();
        yield put(mdbActions.receiveContentUnits(respCU.data.content_units));
      }
      if (cIDsToFetch.length > 0) {
        const respC = responses.shift();
        yield put(mdbActions.receiveCollections(respC.data.collections));
      }
      if (postIDsToFetch.length > 0) {
        const respPost = responses.shift();
        yield put(postsActions.fetchBlogListSuccess(respPost.data));
      }

      if(twitterIDsToFetch.length > 0) {
        //const respTwitter = responses.shift();
        //yield put(postsActions.fetchTweetsSuccess(respTwitter.data));
        /*const tweets = data.search_result.hits.hits.find(h=>h._type === 'tweets_many')._source;
        yield put(postsActions.fetchTweetsSuccess(tweets));*/
      }
    }
    yield put(actions.searchSuccess(data));
  } catch (err) {
    yield put(actions.searchFailure(err));
  }
}

function* click(action) {
  try {
    yield call(Api.click, action.payload);
  } catch (err) {
    console.error('search click logging error:', err);
  }
}

function* updatePageInQuery(action) {
  const page = action.payload > 1 ? action.payload : null;
  yield* urlUpdateQuery(query => Object.assign(query, { page }));
}

function* updateSortByInQuery(action) {
  const sortBy = action.payload;
  yield* urlUpdateQuery(query => Object.assign(query, { sort_by: sortBy }));
}

export function* hydrateUrl() {
  const query                                        = yield* getQuery();
  const { q, page = '1', deb = false, suggest = '' } = query;

  yield put(actions.setDeb(deb));
  yield put(actions.setSuggest(suggest));

  if (q) {
    yield put(actions.updateQuery(q));

    if (query.sort_by) {
      yield put(actions.setSortBy(query.sort_by));
    }

    const pageNo = parseInt(page, 10);
    yield put(actions.setPage(pageNo));
  }
}

function* watchAutocomplete() {
  yield takeLatest(types.AUTOCOMPLETE, autocomplete);
}

function* watchSearch() {
  yield takeLatest(types.SEARCH, search);
}

function* watchClick() {
  yield takeEvery(types.CLICK, click);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

function* watchSetSortBy() {
  yield takeLatest(types.SET_SORT_BY, updateSortByInQuery);
}

function* watchHydrateUrl() {
  yield takeLatest(types.HYDRATE_URL, hydrateUrl);
}

export const sagas = [
  watchAutocomplete,
  watchSearch,
  watchClick,
  watchSetPage,
  watchSetSortBy,
  watchHydrateUrl,
];

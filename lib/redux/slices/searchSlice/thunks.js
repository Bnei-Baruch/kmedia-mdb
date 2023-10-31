import { all, call, put, select } from 'redux-saga/effects';

import Api from '../../../../src/helpers/Api';
import { GenerateSearchId } from '../../../../src/helpers/search';
import { actions, selectors } from './searchSlice';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { actions as mdbActions, mdbSlice } from '../mdbSlice/mdbSlice';
import { actions as postsActions, fetchBlogList } from '../publicationsSlice/thunks';
import { selectors as filterSelectors } from '../filterSlice/filterSlice';
import { selectors as lessonsSelectors, actions as lessonsActions } from '../../../../src/redux/modules/lessons';
import { fetchViewsByUIDs } from '../../../../src/sagas/recommended';
import { filtersTransformer } from '../../../filters';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PAGE_NS_SEARCH } from '../../../../src/helpers/consts';
import { fetchCollections, fetchUnitsByIDs, fetchAllSeries } from '../mdbSlice';
import { publicationsSlice } from '../publicationsSlice';

// TODO: Use debounce after redux-saga updated.
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function* autocomplete(action) {
  try {
    if (!action.payload.autocomplete) {
      yield put(actions.autocompleteSuccess({ suggestions: [] }));
      return;
    }

    yield delay(100);  // Debounce autocomplete.
    const query            = yield select(state => selectors.getQuery(state.search));
    const uiLang           = yield select(state => settings.getUILang(state.settings));
    const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));
    const autocompleteId   = GenerateSearchId();
    const request          = { q: query, ui_language: uiLang, content_languages: contentLanguages };
    let suggestions        = null;
    if (query) {
      const { data }      = yield call(Api.autocomplete, request);
      data.autocompleteId = autocompleteId;
      suggestions         = data;
    }

    yield put(actions.autocompleteSuccess({ suggestions }));
  } catch (err) {
    yield put(actions.autocompleteFailure(err));
  }
}

function getIdsForFetch(hits, types) {
  return hits.reduce((acc, val) => {
    if (types.includes(val._source.result_type)) {
      return acc.concat(val._source.mdb_uid);
    }

    return acc;
  }, []);
}

export const fetchSearch = createAsyncThunk(
  'search/fetch',
  async (payload, thunkAPI) => {
    const state           = thunkAPI.getState();
    const filters         = filterSelectors.getNSFilters(state.filters, PAGE_NS_SEARCH);
    const params          = filtersTransformer.toApiParams(filters);
    const filterKeyValues = Object.entries(params).map(([v, k]) => `${v}:${k}`).join(' ');
    let filterParams      = filterKeyValues ? ` ${filterKeyValues}` : '';

    const uiLang                         = settings.getUILang(state.settings);
    const contentLanguages               = settings.getContentLanguages(state.settings);
    const { query, sortBy, deb, pageNo } = payload;

    const q = query.trim() ? `${query.trim()}${filterParams}` : filterParams;
    if (!q) {
      // If no query nor filters, silently fail the request, don't sent request to backend.
      return {};
    }

    const searchId = GenerateSearchId();
    const request  = {
      q,
      sortBy,
      ui_language: uiLang,
      content_languages: contentLanguages,
      deb,
      searchId,
      pageNo,
      pageSize: 20,
    };

    const { data } = await Api.search(request);

    data.search_result.searchId = searchId;

    if (Array.isArray(data.search_result.hits.hits) && data.search_result.hits.hits.length > 0) {
      // TODO edo: optimize data fetching
      // Server should return associated items (collections, units, posts...) together with search results
      // hmm, relay..., hmm ?
      const cIDsToFetch    = getIdsForFetch(data.search_result.hits.hits, ['collections']);
      const cuIDsToFetch   = getIdsForFetch(data.search_result.hits.hits, ['units', 'sources']);
      const postIDsToFetch = getIdsForFetch(data.search_result.hits.hits, ['posts']);

      if (cuIDsToFetch.length === 0 && cIDsToFetch.length === 0 && postIDsToFetch.length === 0) {
        return { searchResults: data, searchRequest: request, filterParams, query };
      }

     const requests = [];
     /*
      if (cuIDsToFetch.length > 0) {
        requests.push(thunkAPI.dispatch(
          fetchUnitsByIDs({
            id: cuIDsToFetch,
            pageSize: cuIDsToFetch.length,
            ui_language: uiLang,
            content_languages: contentLanguages,
            with_files: true,
            with_derivations: true,
          })
        ));
      }

      if (cIDsToFetch.length > 0) {
        requests.push(thunkAPI.dispatch(
          fetchCollections({
            id: cIDsToFetch,
            pageSize: cIDsToFetch.length,
            ui_language: uiLang,
            content_languages: contentLanguages
          })
        ));
      }

      if (postIDsToFetch.length > 0) {
        requests.push(Api.posts({
            id: postIDsToFetch,
            pageSize: postIDsToFetch.length,
            ui_language: uiLang,
            content_languages: contentLanguages
          })
        );
      }*/

      requests.push(thunkAPI.dispatch(fetchAllSeries({ with_units: true })));
/*
      if (cuIDsToFetch.length > 0) {
        requests.push(thunkAPI.dispatch(fetchViewsByUIDs(cuIDsToFetch)));
      }*/

      const responses = await Promise.all(requests);
    /*  if (cuIDsToFetch.length > 0) {
        const respCU = responses.shift();
        thunkAPI.dispatch(mdbSlice.actions.receiveContentUnits(respCU.data.content_units));
      }*/
    }

    return { searchResults: data, searchRequest: request, filterParams, query };
  }
);
/*

export function* thunks(action) {
  try {
    const query     = yield select(state => selectors.getQuery(state.search));
    const prevQuery = yield select(state => selectors.getPrevQuery(state.search));
    let pageNo      = yield select(state => selectors.getPageNo(state.search));

    // Prepare filters values.
    const filters         = yield select(state => filterSelectors.getFilters(state.filters, 'search'));
    const params          = filtersTransformer.toApiParams(filters);
    const filterKeyValues = Object.entries(params).map(([v, k]) => `${v}:${k}`).join(' ');
    let filterParams      = filterKeyValues ? ` ${filterKeyValues}` : '';

    const q = query.trim() ? `${query.trim()}${filterParams}` : filterParams;
    if (!q) {
      // If no query nor filters, silently fail the request, don't sent request to backend.
      yield put(actions.searchFailure(null));
      return;
    }

    const searchId = GenerateSearchId();
    const request  = {
      q,
      sortBy,
      ui_language: uiLang,
      content_languages: contentLanguages,
      deb,
      searchId,
      pageNo,
      pageSize: 20,
    };

    yield put(actions.setWip());
    const { data } = yield call(Api.search, request);

    data.search_result.searchId = searchId;

    if (Array.isArray(data.search_result.hits.hits) && data.search_result.hits.hits.length > 0) {
      // TODO edo: optimize data fetching
      // Server should return associated items (collections, units, posts...) together with search results
      // hmm, relay..., hmm ?
      const cIDsToFetch    = getIdsForFetch(data.search_result.hits.hits, ['collections']);
      const cuIDsToFetch   = getIdsForFetch(data.search_result.hits.hits, ['units', 'sources']);
      const postIDsToFetch = getIdsForFetch(data.search_result.hits.hits, ['posts']);
      const seriesLoaded   = yield select(state => lessonsSelectors.getSeriesLoaded(state.lessons));

      if (cuIDsToFetch.length === 0 && cIDsToFetch.length === 0 && postIDsToFetch.length === 0 && seriesLoaded) {
        yield put(actions.searchSuccess({ searchResults: data, searchRequest: request, filterParams, query }));
        return;
      }

      const uiLang           = yield select(state => settings.getUILang(state.settings));
      const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));
      const requests         = [];
      if (cuIDsToFetch.length > 0) {
        requests.push(call(Api.units, {
          id: cuIDsToFetch,
          pageSize: cuIDsToFetch.length,
          ui_language: uiLang,
          content_languages: contentLanguages,
          with_files: true,
          with_derivations: true,
        }));
      }

      if (cIDsToFetch.length > 0) {
        requests.push(fetchCollections({
          id: cIDsToFetch,
          pageSize: cIDsToFetch.length,
          ui_language: uiLang,
          content_languages: contentLanguages
        }));
      }

      if (postIDsToFetch.length > 0) {
        requests.push(call(Api.posts({
          id: postIDsToFetch,
          pageSize: postIDsToFetch.length,
          ui_language: uiLang,
          content_languages: contentLanguages
        }));
      }

      if (!seriesLoaded) {
        // Load lesson series if were not loaded yet or language was changed.
        requests.push(call(fetchAllSeries, lessonsActions.fetchAllSeries({ with_units: true })));
      }

      if (cuIDsToFetch.length > 0) {
        requests.push(call(fetchViewsByUIDs, cuIDsToFetch));
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
        yield put(publicationsSlice.actions.receiveBlogPosts(respPost.data));
      }
    }

    yield put(actions.searchSuccess({ searchResults: data, searchRequest: request, filterParams, query }));
  } catch (err) {
    yield put(actions.searchFailure(err));
  }
}
*/

// Propogate URL search params to redux.
/*
export function* hydrateUrl() {
  const urlQuery                       = yield* getQuery();
  const { q, page = '1', deb = false } = urlQuery;

  const reduxQuery  = yield select(state => selectors.getQuery(state.search));
  const reduxPageNo = yield select(state => selectors.getPageNo(state.search));
  const reduxDeb    = yield select(state => selectors.getDeb(state.search));
  if (deb !== reduxDeb) {
    yield put(actions.setDeb(deb));
  }

  if (q) {
    if (q !== reduxQuery) {
      yield put(actions.updateQuery({ query: q, autocomplete: false }));
    }

    if (urlQuery.sort_by) {
      yield put(actions.setSortBy(urlQuery.sort_by));
    }

    const pageNo = parseInt(page, 10);
    if (reduxPageNo !== pageNo) {
      yield put(actions.setPage(pageNo));
    }
  }
}
*/

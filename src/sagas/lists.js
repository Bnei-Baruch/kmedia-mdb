import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/lists';
import { selectors as settings } from '../redux/modules/settings';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { actions as mdbActions } from '../redux/modules/mdb';
import { filtersTransformer } from '../filters';
import { updateQuery } from './helpers/url';
import { CT_LESSON_PART, CT_VIDEO_PROGRAM_CHAPTER } from '../helpers/consts';

function* fetchList(action) {
  const { namespace } = action.payload;
  const filters       = yield select(state => filterSelectors.getFilters(state.filters, namespace));
  const params        = filtersTransformer.toApiParams(filters) || {};
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const args     = {
      ...action.payload,
      ...params,
      language,
    };
    delete args.namespace;

    const endpoint = namespace === 'lessons-daily' ? Api.lessons : Api.units;
    const { data } = yield call(endpoint, args);

    if (Array.isArray(data.content_units)) {
      yield put(mdbActions.receiveContentUnits(data.content_units));
    }
    if (Array.isArray(data.collections)) {
      yield put(mdbActions.receiveCollections(data.collections));

      // TODO edo: optimize data fetching
      // Here comes another call for all content_units we got
      // in order to fetch their possible additional collections.
      // We need this to show 'related to' second line in list.
      // This second round trip to the API is awful,
      // we should strive for a single call to the API and get all the data we need.
      // hmm, relay..., hmm ?
      const cuIDsToFetch = data.collections.reduce((acc, val) => {
        if (Array.isArray(val.content_units)) {
          return acc.concat(val.content_units.map(x => x.id));
        }
        return acc;
      }, []);
      const pageSize     = cuIDsToFetch.length;
      const resp         = yield call(Api.units, { id: cuIDsToFetch, pageSize, language });
      yield put(mdbActions.receiveContentUnits(resp.data.content_units));
    }

    yield put(actions.fetchListSuccess(namespace, data));
  } catch (err) {
    yield put(actions.fetchListFailure(namespace, err));
  }
}

function* fetchIntents(action) {
  const { namespace, params }     = action.payload;
  const { content_type, ...args } = params;

  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    let endpoint;
    switch (content_type) {
    case CT_LESSON_PART:
      endpoint = Api.lessons;
      break;
    case CT_VIDEO_PROGRAM_CHAPTER:
      endpoint = Api.units;
      break;
    }

    const { data } = yield call(endpoint, { ...args, language, with_files: true });

    if (Array.isArray(data.content_units)) {
      yield put(mdbActions.receiveContentUnits(data.content_units));
    }
    if (Array.isArray(data.collections)) {
      yield put(mdbActions.receiveCollections(data.collections));

      // TODO edo: optimize data fetching
      // Here comes another call for all content_units we got
      // in order to fetch their possible additional collections.
      // We need this to show 'related to' second line in list.
      // This second round trip to the API is awful,
      // we should strive for a single call to the API and get all the data we need.
      // hmm, relay..., hmm ?
      const cuIDsToFetch = data.collections.reduce((acc, val) => {
        if (Array.isArray(val.content_units)) {
          return acc.concat(val.content_units.map(x => x.id));
        }
        return acc;
      }, []);
      const pageSize     = cuIDsToFetch.length;
      const resp         = yield call(Api.units, { id: cuIDsToFetch, pageSize, language });
      yield put(mdbActions.receiveContentUnits(resp.data.content_units));
    }

    yield put(actions.fetchListSuccess(namespace, data));
  } catch (err) {
    yield put(actions.fetchListFailure(namespace, err));
  }
}

function* updatePageInQuery(action) {
  const { pageNo } = action.payload;
  const page       = pageNo > 1 ? pageNo : null;

  if (page) {
    // adding a page to browser history
    yield put(push(page));
  }

  yield* updateQuery(query => Object.assign(query, { page }));
}

function* watchFetchList() {
  yield takeLatest(types.FETCH_LIST, fetchList);
}

function* watchFetchIntents() {
  yield takeEvery(types.FETCH_INTENTS, fetchIntents);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [
  watchFetchList,
  watchFetchIntents,
  watchSetPage,
];

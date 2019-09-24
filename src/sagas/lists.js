import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/lists';
import { selectors as settings } from '../redux/modules/settings';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { actions as mdbActions } from '../redux/modules/mdb';
import { filtersTransformer } from '../filters';
import Api from '../helpers/Api';
import { CT_LESSON_PART } from '../helpers/consts';
import { getQuery, pushQuery } from './helpers/url';

function* fetchList(action) {
  const { namespace } = action.payload;

  let endpoint;
  const args = { ...action.payload };
  if (namespace.startsWith('intents')) {
    args.with_files = true;
    endpoint        = args.content_type === CT_LESSON_PART ? Api.lessons : Api.units;
  } else {
    const filters      = yield select(state => filterSelectors.getFilters(state.filters, namespace));
    const filterParams = filtersTransformer.toApiParams(filters) || {};
    Object.assign(args, filterParams);
    endpoint = namespace === 'lessons-daily' ? Api.lessons : Api.units;
  }
  delete args.namespace;

  const language = yield select(state => settings.getLanguage(state.settings));

  try {
    const { data } = yield call(endpoint, { ...args, language });

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
  const { pageNo }   = action.payload;
  let currentQuery = yield* getQuery();
  const page = currentQuery.page || 1;
  if (pageNo === +page) {
    return;
  }

  yield* pushQuery((query) => {
    if (pageNo > 0) {
      return { ...query, page: pageNo };
    }
    const { _page, ...result } = query;
    return result;
  });
}

function* watchFetchList() {
  yield takeEvery(types.FETCH_LIST, fetchList);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [
  watchFetchList,
  watchSetPage,
];

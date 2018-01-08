import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/lists';
import { selectors as settings } from '../redux/modules/settings';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { actions as mdbActions } from '../redux/modules/mdb';
import { filtersTransformer } from '../filters';
import { updateQuery } from './helpers/url';

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

    const { data } = yield call(Api.units, args);

    if (Array.isArray(data.content_units)) {
      yield put(mdbActions.receiveContentUnits(data.content_units));
    }
    if (Array.isArray(data.collections)) {
      yield put(mdbActions.receiveCollections(data.collections));
    }

    yield put(actions.fetchListSuccess(namespace, data));
  } catch (err) {
    yield put(actions.fetchListFailure(namespace, err));
  }
}

function* updatePageInQuery(action) {
  const { pageNo } = action.payload;
  const page       = pageNo > 1 ? pageNo : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

function* watchFetchList() {
  yield takeLatest(types.FETCH_LIST, fetchList);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [
  watchFetchList,
  watchSetPage,
];

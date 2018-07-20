import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/twitter';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';
import { updateQuery } from './helpers/url';

export function* fetchData(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, 'twitter'));
  const params  = filtersTransformer.toApiParams(filters) || {};
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const args     = {
      ...action.payload,
      ...params,
      language,
    };

    const { data } = yield call(Api.tweets, args);
    yield put(actions.fetchDataSuccess(data));
  } catch (err) {
    yield put(actions.fetchDataFailure(err));
  }
}

function* updatePageInQuery(action) {
  const { pageNo } = action.payload;
  const page       = pageNo > 1 ? pageNo : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

function* watchFetchData() {
  yield takeLatest([types.FETCH_DATA], fetchData);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [
  watchFetchData,
  watchSetPage,
];

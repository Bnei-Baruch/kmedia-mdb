import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/publications';

export function* fetchTweets(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, 'publications-twitter'));
  const params  = filtersTransformer.toApiParams(filters) || {};
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.publishers, { language });
    yield put(actions.fetchPublishersSuccess(data));
  } catch (err) {
    yield put(actions.fetchPublishersFailure(err));
  }
}

function* watchFetchPublishers() {
  yield takeLatest(types.FETCH_PUBLISHERS, fetchPublishers);
}

export const sagas = [
  watchFetchPublishers,
];

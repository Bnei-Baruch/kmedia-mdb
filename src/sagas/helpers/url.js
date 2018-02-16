import { put, select } from 'redux-saga/effects';
import { replace } from 'react-router-redux';

import { getQuery as urlGetQuery, stringify } from '../../helpers/url';

export function* getQuery() {
  const router = yield select(state => state.router);
  return urlGetQuery(router.location);
}

export function* updateQuery(updater) {
  const query = yield* getQuery();
  yield put(replace({ search: stringify(updater(query)) }));
}

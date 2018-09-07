import { put, select } from 'redux-saga/effects';
import { replace, push } from 'react-router-redux';

import { getQuery as urlGetQuery, stringify } from '../../helpers/url';

export function* getQuery() {
  const router = yield select(state => state.router);
  return urlGetQuery(router.location);
}

export function* updateQuery(updater) {
  const query = yield* getQuery();
  yield put(replace({ search: stringify(updater(query)) }));
}

export function* pushQuery(updater) {
  const query = yield* getQuery();
  yield put(push({ search: stringify(updater(query)) }));
}

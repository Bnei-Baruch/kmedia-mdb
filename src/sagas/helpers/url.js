import { put, select } from 'redux-saga/effects';
import qs from 'qs';
import { replace } from 'react-router-redux';

export function* getQuery() {
  const router = yield select(state => state.router);
  return qs.parse(router.location.search.slice(1));
}

export function* updateQuery(updater) {
  const query    = yield* getQuery();
  const newQuery = updater(query);
  const search = qs.stringify(newQuery, { arrayFormat: 'repeat', skipNulls: true });
  yield put(replace({ search }));
}

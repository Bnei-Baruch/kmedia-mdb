import { put, select } from 'redux-saga/effects';
import { replace } from 'react-router-redux';

import { parse, stringify } from '../../helpers/url';

export function* getQuery() {
  const router = yield select(state => state.router);
  return parse(router.location.search.slice(1));
}

export function* updateQuery(updater) {
  const query = yield* getQuery();
  yield put(replace({ search: stringify(updater(query)) }));
}

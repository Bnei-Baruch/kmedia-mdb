import { put, select } from 'redux-saga/effects';
import { push, replace } from 'connected-react-router';

import { getQuery as urlGetQuery, stringify } from '../../helpers/url';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as listsSelectors } from '../../redux/modules/lists';
import { filtersTransformer } from '../../filters';

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

export function* setTab(action) {
  // we have to replace url completely...

  const namespace = action.payload;
  const filters   = yield select(state => filterSelectors.getFilters(state.filters, namespace));
  const lists     = yield select(state => listsSelectors.getNamespaceState(state.lists, namespace));
  const q         = {
    page: lists.pageNo,
    ...filtersTransformer.toQueryParams(filters),
  };

  yield* pushQuery((query) => {
    const x = Object.assign(query, q);
    if (x.page === 1) {
      delete x.page;
    }
    return x;
  });
}

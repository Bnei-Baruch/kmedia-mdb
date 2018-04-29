import { select, takeLatest } from 'redux-saga/effects';

import { updateQuery } from './helpers/url';
import { types } from '../redux/modules/lectures';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { selectors as listsSelectors } from '../redux/modules/lists';
import { filtersTransformer } from '../filters';

function* setTab(action) {
  // we have to replace url completely...

  const tab       = action.payload;
  const namespace = `lectures-${tab}`;
  const filters   = yield select(state => filterSelectors.getFilters(state.filters, namespace));
  const lists     = yield select(state => listsSelectors.getNamespaceState(state.lists, namespace));
  const q         = {
    page: lists.pageNo,
    ...filtersTransformer.toQueryParams(filters),
  };

  yield* updateQuery((query) => {
    const x = Object.assign(query, q);
    if (x.page === 1) {
      delete x.page;
    }
    return x;
  });
}

function* watchSetTab() {
  yield takeLatest(types.SET_TAB, setTab);
}

export const sagas = [
  watchSetTab,
];

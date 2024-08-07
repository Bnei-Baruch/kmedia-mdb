import { put, select, takeEvery } from 'redux-saga/effects';

import { getQuery, pushQuery } from './helpers/url';
import { actions as filterActions, selectors as filterSelectors, types as filterTypes } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';

/*
 * When a filter value is changed, the query is also changed to match..
 * The params in the query can have the filter's name and value transformed
 * (to for example a different string representation)
 *
 * The filters values can be hydrated (by dispatching hydrateFilters)
 * from a query containing keys and values matching filters that know how to transform them.
 * The hydration is needed when we mount a page containing filters and we have a query full of filter values
 * (this enables us to link to specific results).
 * You can know that filter values have been hydrated when the filtersHydrated action is dispatched.
 *
 * The sagas will catch actions that change filter values and update the query accordingly.
 * NOTE: if you add new actions you'll need to watch for those too.
 */

function* pushFilterValuesInQuery(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, action.payload.namespace));

  yield* pushQuery(query => Object.assign(query, filtersTransformer.toQueryParams(filters)));
}

export function* hydrateFilters(action) {
  const query   = yield* getQuery();
  const filters = filtersTransformer.fromQueryParams(query);
  yield put(filterActions.setHydratedFilterValues(action.payload.namespace, filters));
}

const valueChangingActions = [
  filterTypes['filters/setFilterValue'],
  filterTypes['filters/setFilterValueMulti'],
  filterTypes['filters/resetFilter'],
  filterTypes['filters/resetNamespace']
];

function* watchFilterValueChange() {
  yield takeEvery(valueChangingActions, pushFilterValuesInQuery);
}

function* watchHydrateFilters() {
  yield takeEvery(filterTypes['filters/hydrateFilters'], hydrateFilters);
}

export const sagas = [
  watchFilterValueChange,
  watchHydrateFilters
];

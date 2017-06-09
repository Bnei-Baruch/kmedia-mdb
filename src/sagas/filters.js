import { takeEvery, select, put } from 'redux-saga/effects';
import qs from 'qs';
import moment from 'moment';
import without from 'lodash/without';
import { replace } from 'react-router-redux';
import { createMapper } from '../helpers/utils';
import {
  types as filterTypes,
  actions as filterActions
} from '../redux/modules/filters';

/*
 * When a filter value is changed, the query is also changed to match..
 * The params in the query can have the filter's name and value transformed (to for example a different string representation)
 * The filters values can be hydrated (by dispatching HYDRATE_FILTERS) from a query containing keys and values matching filters that know how to transform them.
 * The hydration is needed when a we mount a page containing filters and we have a query full of filter values (this enables us to link to specific results).
 * You can know that filter values have been hydrated when the FILTERS_HYDRATED action is dispatched.
 *
 * The sagas will catch actions that change filter values and update the query accordingly.
 * NOTE: if you add new actions you'll need to watch for those too.
 */

const filterToQueryMap = {
  'date-filter': (value) => {
    if (!value) {
      return '';
    }

    return {
      dates: `${moment(value.from).format('DD-MM-YYYY')}_${moment(value.to).format('DD-MM-YYYY')}`,
    };
  },
  'sources-filter': value => ({ sources: value.join('_') })
};

const queryToFilterMap = {
  dates: (value) => {
    const parts = value.split('_');

    return {
      'date-filter': {
        from: moment(parts[0], 'DD-MM-YYYY').toDate(),
        to: moment(parts[1], 'DD-MM-YYYY').toDate()
      }
    };
  },
  sources: value => ({
    'sources-filter': Array.isArray(value) ? value.map(singleValue => singleValue.split('_')) : [value.split('_')]
  })
};

const transformFilterToQuery = createMapper(filterToQueryMap);
const transformQueryToFilter = createMapper(queryToFilterMap);

function* getQuery() {
  const router = yield select(state => state.router);
  const query = qs.parse(router.location.search.slice(1));

  return query;
}

function* setFilterValueToUrl(action) {
  const query = yield* getQuery();

  const { name, value } = action.payload;
  const param = transformFilterToQuery(name, value);

  yield put(replace({
    search: `?${qs.stringify({ ...query, ...param }, { arrayFormat: 'repeat' })}`
  }));
}

function* addFilterValueToUrl(action) {
  const query = yield* getQuery();

  const { name, value } = action.payload;
  const param = transformFilterToQuery(name, value);

  yield put(replace({
    search: `?${qs.stringify({
      ...(Object.keys(param).reduce((acc, key) => {
        const paramValue = param[key];
        if (paramValue) {
          const paramValues = (Array.isArray(paramValue) ? paramValue : [paramValue]);
          const queryValue = acc[key];
          if (Array.isArray(queryValue)) {
            acc[key] = [...queryValue, ...paramValues];
          } else {
            acc[key] = [queryValue, ...paramValues];
          }
        }

        return acc;
      }, { ...query }))
    }, { arrayFormat: 'repeat' })}`
  }));
}

function* removeFilterValueFromUrl(action) {
  const query = yield* getQuery();

  const { name, value } = action.payload;
  const param = transformFilterToQuery(name, value);

  yield put(replace({
    search: `?${qs.stringify({
      ...(Object.keys(param).reduce((acc, key) => {
        const paramValue = param[key];
        if (paramValue) {
          const paramValues = (Array.isArray(paramValue) ? paramValue : [paramValue]);
          const queryValue = acc[key];
          if (Array.isArray(queryValue)) {
            acc[key] = without(queryValue, ...paramValues);
          } else if (paramValues.includes(queryValue)) {
            delete acc[key];
          }
        }

        return acc;
      }, { ...query }))
    }, { arrayFormat: 'repeat' })}`
  }));
}

function* hydrateFilters(action) {
  const { namespace, from } = action.payload;
  let filters;

  if (from === 'query') {
    const query = yield* getQuery();
    const params = qs.parse(query);

    filters = Object.keys(params).reduce((acc, key) => ({
      ...acc,
      ...transformQueryToFilter(key, params[key])
    }), {});
  }

  if (filters) {
    yield put(filterActions.setHydratedFilterValues(namespace, filters));
    yield put(filterActions.filtersHydrated(namespace));
  }
}

function* watchAddFilter() {
  yield takeEvery(filterTypes.ADD_FILTER_VALUE, addFilterValueToUrl);
}

function* watchSetFilter() {
  yield takeEvery(filterTypes.SET_FILTER_VALUE, setFilterValueToUrl);
}

function* watchRemoveFilter() {
  yield takeEvery(filterTypes.REMOVE_FILTER_VALUE, removeFilterValueFromUrl);
}

function* watchHydrateFilters() {
  yield takeEvery(filterTypes.HYDRATE_FILTERS, hydrateFilters);
}

export const sagas = [
  watchAddFilter,
  watchSetFilter,
  watchRemoveFilter,
  watchHydrateFilters
];

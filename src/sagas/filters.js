import { takeEvery, select, put } from 'redux-saga/effects';
import qs from 'qs';
import moment from 'moment';
import without from 'lodash/without';
import { replace } from 'react-router-redux';
import { createMapper } from '../helpers/utils';
import {
  types as filterTypes,
  actions as filterActions,
  selectors as filterSelectors
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

    if (Array.isArray(value) && value[0]) {
      // eslint-disable-next-line no-param-reassign
      value = value[0];
    }

    return {
      dates: `${moment(value.from).format('DD-MM-YYYY')}_${moment(value.to).format('DD-MM-YYYY')}`,
    };
  },
  'sources-filter': value => ({ source: value.map(singleValue => singleValue.join('_')) }),
  'topics-filter': value => ({ topic: value })
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
  source: value => ({
    'sources-filter': Array.isArray(value) ? value.map(singleValue => singleValue.split('_')) : [value.split('_')]
  }),
  topic: value => ({
    'topics-filter': value
  })
};

const transformFilterToQuery = createMapper(filterToQueryMap);
const transformQueryToFilter = createMapper(queryToFilterMap, () => null);

function* getQuery() {
  const router = yield select(state => state.router);
  const query = qs.parse(router.location.search.slice(1));

  return query;
}

function* updateFilterValuesInQuery(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, action.payload.namespace));

  yield put(replace({
    search: `?${qs.stringify({
      ...filters.reduce((acc, filter) => {
        const param = transformFilterToQuery(filter.name, filter.values || []);
        return Object.assign(acc, param);
      }, {})
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

const valueChangingActions = [
  filterTypes.ADD_FILTER_VALUE,
  filterTypes.SET_FILTER_VALUE,
  filterTypes.REMOVE_FILTER_VALUE
];

function* watchFilterValueChange() {
  yield takeEvery(valueChangingActions, updateFilterValuesInQuery);
}

function* watchHydrateFilters() {
  yield takeEvery(filterTypes.HYDRATE_FILTERS, hydrateFilters);
}

export const sagas = [
  watchFilterValueChange,
  watchHydrateFilters
];

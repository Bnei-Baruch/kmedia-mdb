import { takeEvery, select, put } from 'redux-saga/effects';
import qs from 'qs';
import moment from 'moment';
import identity from 'lodash/identity';
import without from 'lodash/without';
import { replace } from 'react-router-redux';
import {
  types as filterTypes,
  actions as filterActions
} from '../redux/modules/filters';


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
      'date-filter': [{
        from: moment(parts[0], 'DD-MM-YYYY').toDate(),
        to: moment(parts[1], 'DD-MM-YYYY').toDate()
      }]
    };
  },
  sources: value => ({
    'sources-filter': Array.isArray(value) ? value.map(singleValue => singleValue.split('_')) : [value.split('_')]
  })
};

const createMapper = (mapperObj, defaultTransform = identity) => (key, value) => {
  const transform = mapperObj[key] || mapperObj.default;
  if (transform) {
    return transform(value);
  }

  return defaultTransform(value);
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
  yield takeEvery(filterTypes.HYDRATE, hydrateFilters);
}

export const sagas = [
  watchAddFilter,
  watchSetFilter,
  watchRemoveFilter,
  watchHydrateFilters
];

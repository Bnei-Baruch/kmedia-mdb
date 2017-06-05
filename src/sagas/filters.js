import { takeEvery, select, put } from 'redux-saga/effects';
import qs from 'qs';
import moment from 'moment';
import without from 'lodash/without';
import { replace } from 'react-router-redux';
import { types as filterTypes, selectors as filterSelectors } from '../redux/modules/filters';


const filterToQueryMapper = {
  'date-filter': (value) => {
    if (!value) {
      return '';
    }

    return {
      from: moment(value.from).format('DD-MM-YYYY'),
      to: moment(value.to).format('DD-MM-YYYY')
    };
  },
  'sources-filter': value => ({ sources: value.join('_') })
};

const transformFilterToQuery = (filterName, value) => {
  const transform = filterToQueryMapper[filterName];
  if (transform) {
    return transform(value);
  }

  return value;
};

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
    search: `?${qs.stringify({ ...query, ...param })}`
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
    })}`
  }));
}

function* removeFilterValueFromUrl(action) {
  const query = yield* getQuery();

  const { name, value } = action.payload;
  const param = transformFilterToQuery(name, value);

  console.log('query: ', query);
  console.log('filterParam: ', param);

  yield put(replace({
    search: `?${qs.stringify({
      ...(Object.keys(param).reduce((acc, key) => {
        const paramValue = param[key];
        if (paramValue) {
          const paramValues = (Array.isArray(paramValue) ? paramValue : [paramValue]);
          const queryValue = acc[key];
          console.log('queryValue: ', queryValue);
          console.log('paramValues: ', paramValues);
          if (Array.isArray(queryValue)) {
            acc[key] = without(queryValue, ...paramValues);
          } else if (paramValues.includes(queryValue)) {
            delete acc[key];
          }
        }

        return acc;
      }, { ...query }))
    })}`
  }));
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

export const sagas = [
  watchAddFilter,
  watchSetFilter,
  watchRemoveFilter
];

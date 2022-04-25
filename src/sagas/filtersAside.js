import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/filtersAside';
import Api from '../helpers/Api';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';
import uniq from 'lodash/uniq';

const RESULT_NAME_BY_PARAM = {
  'tag': 'tags',
  'source': 'sources',
  'author': 'sources',
  'content_type': 'content_types'
};

export function* fetchStat(action) {
  const { namespace, params, isPrepare } = action.payload;

  let filterParams = {};
  if (!isPrepare) {
    const filters = yield select(state => filterSelectors.getFilters(state.filters, namespace));
    filterParams  = filtersTransformer.toApiParams(filters) || {};
  }

  //need when was filtered by base param (for example filter by topics on the topic page)
  let isFilteredByBase = false;
  Object.keys(params).forEach(p => {
    if (filterParams[p]) {
      filterParams[p]  = filterParams[p].filter(x => params[p] !== x);
      isFilteredByBase = filterParams[p].length > 0;
    } else {
      filterParams[p] = params[p];
    }
  });

  try {
    filterParams.for_filter = true;

    const requests = [];

    requests.push(call(Api.unitsStats, filterParams));
    requests.push(call(Api.collectionsStats, filterParams));
    requests.push(call(Api.labelsStats, filterParams));
    if (isFilteredByBase) {
      const paramsPart = { ...filterParams, ...params };
      requests.push(call(Api.unitsStats, paramsPart));
      requests.push(call(Api.collectionsStats, paramsPart));
      requests.push(call(Api.labelsStats, paramsPart));
    }

    const responses = yield all(requests);

    const { data: dataCU }          = responses.shift();
    const { data: dataC }           = responses.shift();
    const { data: dataL }           = responses.shift();
    const { data: dataCUPart = {} } = responses.shift() || {};
    const { data: dataCPart = {} }  = responses.shift() || {};
    const { data: dataLPart = {} }  = responses.shift() || {};

    uniq(Object.keys(params).map(x => RESULT_NAME_BY_PARAM[x])).forEach(n => {
      dataCU[n] = dataCUPart[n];
      dataC[n]  = dataCPart[n];
      dataL[n]  = dataLPart[n];
    });

    yield put(actions.fetchStatsSuccess({ dataCU, dataC, dataL, namespace, isPrepare }));
  } catch (err) {
    yield put(actions.fetchStatsFailure(namespace, err));
  }
}

function* watchFetchStat() {
  yield takeEvery(types.FETCH_STATS, fetchStat);
}

export const sagas = [
  watchFetchStat,
];

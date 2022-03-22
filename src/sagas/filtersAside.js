import { call, put, select, takeEvery } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/filtersAside';
import { selectors as settings } from '../redux/modules/settings';
import Api from '../helpers/Api';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';

export function* fetchStat(action) {
  const { namespace, params, isPrepare } = action.payload;

  params.language  = yield select(state => settings.getContentLanguage(state.settings));
  let filterParams = {};
  if (!isPrepare) {
    const filters = yield select(state => filterSelectors.getFilters(state.filters, namespace));
    filterParams  = filtersTransformer.toApiParams(filters) || {};
  }
  Object.keys(params).forEach(p => {
    filterParams[p] = [...(filterParams[p] || []), params[p]];
  });

  try {
    const { data: dataCU } = yield call(Api.unitsStats, filterParams);
    const { data: dataL }  = yield call(Api.labelsStats, filterParams);

    yield put(actions.fetchStatsSuccess({ dataCU, dataL, namespace, isPrepare }));
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

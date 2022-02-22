import { call, put, select, takeEvery } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/filtersAside';
import { selectors as settings } from '../redux/modules/settings';
import Api from '../helpers/Api';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';

export function* fetchStat(action) {
  const { namespace, params, isPrepare } = action.payload;

  const language = yield select(state => settings.getContentLanguage(state.settings));
  const filters  = yield select(state => filterSelectors.getFilters(state.filters, namespace));

  let rest = { ...params, language };

  if (!isPrepare) {
    const filterParams = filtersTransformer.toApiParams(filters) || {};
    rest               = { ...filterParams, ...rest };
  }

  try {
    const { data } = yield call(Api.unitsStats, rest);

    yield put(actions.fetchStatsSuccess({ data, namespace, isPrepare }));
  } catch (err) {
    yield put(actions.fetchStatsFailure(err));
  }
}

function* watchFetchStat() {
  yield takeEvery(types.FETCH_STATS, fetchStat);
}

export const sagas = [
  watchFetchStat,
];

import { call, put, takeLatest, select } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_LIKUTIM } from '../helpers/consts';
import { actions, types } from '../redux/modules/likutim';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';

function* fetchLikutim(action) {
  try {
    const { namespace }    = action.payload;
    const filters      = yield select(state => filterSelectors.getFilters(state.filters, namespace));
    const filterParams = filtersTransformer.toApiParams(filters) || {};

    const pageSize = 10000;
    const language = yield select(state => settings.getContentLanguage(state.settings));
    const { data } = yield call(Api.units, { content_type: CT_LIKUTIM, language, pageSize, ...filterParams });

    if (Array.isArray(data.content_units)) {
      yield put(mdbActions.receiveContentUnits(data.content_units));
      yield put(actions.fetchLikutimSuccess(data))
    }
  } catch (err) {
    yield put(actions.fetchLikutimFailure(err));
  }
}

function* watchFetchLikutim() {
  yield takeLatest(types.FETCH_LIKUTIM, fetchLikutim);
}

export const sagas = [
  watchFetchLikutim,
]

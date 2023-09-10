import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_LESSON_PART, PAGE_NS_LESSONS } from '../helpers/consts';
import { isEmpty } from '../helpers/utils';
import { actions, selectors, types as stats } from '../redux/modules/stats';
import { types as tags } from '../../lib/redux/slices/tagsSlice/tagsSlice';

function* fetchCUStats(action) {
  const { namespace } = action.payload;
  if (namespace.startsWith('intents')) {
    return;
  }

  // fetch once
  const nsState = yield select(state => selectors.getCUStats(state.stats, namespace));
  if (!isEmpty(nsState) && !isEmpty(nsState.data)) {
    return;
  }

  const args = { ...action.payload };
  if (namespace === PAGE_NS_LESSONS) {
    args.content_type = [CT_LESSON_PART];
  }

  delete args.namespace;

  yield* callUnitsStats(args, namespace);
}

export function* callUnitsStats(args, namespace) {
  try {
    const { data } = yield call(Api.unitsStats, args);

    yield put(actions.fetchCUStatsSuccess(namespace, data));
  } catch (err) {
    yield put(actions.fetchCUStatsFailure(namespace, err));
  }
}

function* watchFetchList() {
  //yield takeLatest([tags.FETCH_STATS], fetchCUStats);
  yield takeEvery([stats.FETCH_CU_STATS], fetchCUStats);
}

export const sagas = [
  watchFetchList,
];

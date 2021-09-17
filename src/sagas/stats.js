import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_LESSON_PART } from '../helpers/consts';
import { isEmpty } from '../helpers/utils';
import { actions, selectors } from '../redux/modules/stats';
import { types as lists } from '../redux/modules/lists';
import { types as tags } from '../redux/modules/tags';

function* fetchCUStats(action) {
  const { namespace } = action.payload;
  if (namespace.startsWith('intents')) {
    return;
  }

  // fetch once
  const nsState = yield select(state => selectors.getCUStats(state.stats, namespace));
  if (!isEmpty(nsState) && !isEmpty(nsState.data)) {
    // console.log('Allready in cache');
    return;
  }

  // console.log('not in cache');

  const args = { ...action.payload };
  if (namespace === 'lessons-daily') {
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
  yield takeLatest([lists.FETCH_LIST, tags.FETCH_STATS], fetchCUStats);
}

export const sagas = [
  watchFetchList,
];

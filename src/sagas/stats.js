import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_LESSONS_SERIES, CT_LESSON_PART, CT_LIKUTIM } from '../helpers/consts';
import { isEmpty } from '../helpers/utils';
import { actions, selectors } from '../redux/modules/stats';
import { types as lists } from '../redux/modules/lists';
import { types as tags } from '../redux/modules/tags';
import { types as stats } from '../redux/modules/stats';
import { types as lessons } from '../redux/modules/lessons';
import { types as likutim } from '../redux/modules/likutim';

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

  switch (namespace) {
    case 'lessons-daily':
      args.content_type = CT_LESSON_PART;
      break;

      // case 'lessons-series':
      //   args.content_type = CT_LESSONS_SERIES;
      //   break;

    case 'likutim':
      args.content_type = CT_LIKUTIM;
      break;

    default:
      break;
  }

  delete args.namespace;

  yield* callUnitsStats(args, namespace);
}

export function* callUnitsStats(args, namespace) {
  try {
    // console.log('callUnitsStats:', args, namespace)
    const { data } = yield call(Api.unitsStats, args);
    // console.log('stats data:', data)

    yield put(actions.fetchCUStatsSuccess(namespace, data));
  } catch (err) {
    yield put(actions.fetchCUStatsFailure(namespace, err));
  }
}

function* watchFetchList() {
  yield takeLatest([lists.FETCH_LIST, tags.FETCH_STATS, stats.FETCH_CU_STATS], fetchCUStats);

function* watchFetchCUStats() {
  yield takeLatest([lists.FETCH_LIST, lessons.FETCH_ALL_SERIES, likutim.FETCH_LIKUTIM, tags.FETCH_STATS], fetchCUStats);
}

export const sagas = [
  watchFetchList,
  watchFetchCUStats
];

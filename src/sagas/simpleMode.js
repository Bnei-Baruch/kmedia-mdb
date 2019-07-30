import { call, put, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/simpleMode';
import { actions as mdbActions } from '../redux/modules/mdb';

export function* fetchForDate(action) {
  try {
    const args = {
      startDate: action.payload.date,
      endDate: action.payload.date,
      language: action.payload.language,
    };

    const { data } = yield call(Api.simpleMode, args);

    if (Array.isArray(data.lessons) && data.lessons.length > 0) {
      yield put(mdbActions.receiveCollections(data.lessons));
    }
    if (Array.isArray(data.others) && data.others.length > 0) {
      yield put(mdbActions.receiveContentUnits(data.others));
    }

    yield put(actions.fetchForDateSuccess(data));
  } catch (err) {
    yield put(actions.fetchForDateFailure(err));
  }
}

function* watchFetchForDate() {
  yield takeLatest([types.FETCH_FOR_DATE], fetchForDate);
}

export const sagas = [
  watchFetchForDate,
];

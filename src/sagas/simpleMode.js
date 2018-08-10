import { call, put, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/simpelMode';

export function* fetchAllMediaForDate(action) {
  try {
    const args = {
      startDate: action.payload.date,
      endDate: action.payload.date,
      language: action.payload.language,
    };

    const { data } = yield call(Api.simpleMode, args);
    yield put(actions.fetchAllMediaForDateSuccess(data));
  } catch (err) {
    yield put(actions.fetchAllMediaForDateFailure(err));
  }
}

function* watchFetchAllMedia() {
  yield takeLatest([types.FETCH_ALL_MEDIA_FOR_DATE], fetchAllMediaForDate);
}

export const sagas = [
  watchFetchAllMedia,
];

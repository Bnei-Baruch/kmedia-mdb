import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/simpelMode';

export function* fetchAllMediaForDate(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const args     = {
      startDate: action.payload.date,
      endDate: action.payload.date,
      language,
    };

    const { data } = yield call(Api.simpleMode, args);
    yield put(actions.fetchAllMediaForDateSuccess(data));
  } catch (err) {
    yield put(actions.fetchAllMediaForDateFailure(err));
  }
}

function* watchFetchAllMedia() {
  yield takeLatest([types.FETCH_DATA], fetchAllMediaForDate);
}

export const sagas = [
  watchFetchAllMedia,
];

import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/home';
import { actions as mdb } from '../redux/modules/mdb';

export function* fetchData() {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.home, { language });
    yield put(mdb.receiveCollections([data.latest_daily_lesson]));
    yield put(mdb.receiveContentUnits(data.latest_units));
    yield put(actions.fetchDataSuccess(data));
  } catch (err) {
    yield put(actions.fetchDataFailure(err));
  }
}

export function* fetchBanner(action) {
  try {
    const { data } = yield call(Api.getCMS, 'banner', {
      language: action.payload,
    });
    yield put(actions.fetchBannerSuccess(data));
  } catch (err) {
    yield put(actions.fetchBannerFailure(err));
  }
}

function* watchFetchData() {
  yield takeLatest([types.FETCH_DATA], fetchData);
}

function* watchFetchBanner() {
  yield takeLatest([types.FETCH_BANNER], fetchBanner);
}

export const sagas = [
  watchFetchData,
  watchFetchBanner,
];


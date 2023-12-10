import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/home';
import { actions as mdbActions } from '../redux/modules/mdb';

export function* fetchData() {
  try {
    const uiLang           = yield select(state => settings.getUILang(state.settings));
    const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));

    console.log('fetchData home', uiLang, contentLanguages);
    const { data } = yield call(Api.home, {
      ui_language      : uiLang,
      content_languages: contentLanguages
    });
    yield put(mdbActions.receiveCollections([data.latest_daily_lesson, ...data.latest_cos]));
    yield put(mdbActions.receiveContentUnits(data.latest_units));
    yield put(actions.fetchDataSuccess(data));
  } catch (err) {
    yield put(actions.fetchDataFailure(err));
  }
}

export function* fetchBanner(action) {
  try {
    const { data } = yield call(Api.getCMS, 'banner', {
      contentLanguages: action.payload
    });
    yield put(actions.fetchBannersSuccess(data));
  } catch (err) {
    yield put(actions.fetchBannersFailure(err));
  }
}

function* watchFetchData() {
  yield takeLatest([types['home/fetchData']], fetchData);
}

function* watchFetchBanner() {
  yield takeLatest([types['home/fetchBanner']], fetchBanner);
}

export const sagas = [
  watchFetchData,
  watchFetchBanner
];


import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/home';
import { actions as mdbActions } from '../redux/modules/mdb';
import { settingsGetContentLanguagesSelector, settingsGetUILangSelector } from '../redux/selectors';

export function* fetchData() {
  console.log('fetchData');
  try {
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);

    console.log('fetchData home', uiLang, contentLanguages);
    const { data } = yield call(Api.home, {
      ui_language      : uiLang,
      content_languages: contentLanguages
    });
    console.log('fetchData home done', uiLang, contentLanguages);
    yield put(mdbActions.receiveCollections([data.latest_daily_lesson, ...data.latest_cos]));
    console.log('fetchData B', uiLang, contentLanguages);
    yield put(mdbActions.receiveContentUnits(data.latest_units));
    console.log('fetchData C', uiLang, contentLanguages);
    yield put(actions.fetchDataSuccess(data));
  } catch (err) {
    yield put(actions.fetchDataFailure(err));
  }
}

export function* fetchBanner(action) {
  console.log('fetchBanner');
  try {
    console.log('fetchBanner api before');
    const { data } = yield call(Api.getCMS, 'banner', {
      contentLanguages: action.payload
    });
    console.log('fetchBanner api done');
    yield put(actions.fetchBannersSuccess(data));
  } catch (err) {
    console.log('fetchData E');
    yield put(actions.fetchBannersFailure(err));
  }
}

function* watchFetchData() {
  yield takeLatest([types['home/fetchData']], fetchData);
}

function* watchFetchBanner() {
  yield takeLatest([types['home/fetchBanners']], fetchBanner);
}

export const sagas = [
  watchFetchData,
  watchFetchBanner
];


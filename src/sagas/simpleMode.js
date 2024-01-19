import { call, put, select, takeLatest } from 'redux-saga/effects';
import moment from 'moment';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/simpleMode';
import { actions as mbdActions } from '../redux/modules/mdb';
import { settingsGetContentLanguagesSelector, settingsGetUILangSelector } from '../redux/selectors';

export function* fetchForDate(action) {
  try {
    const { date }      = action.payload;
    const formattedDate = moment(date).format('YYYY-MM-DD');

    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);

    const args = {
      startDate        : formattedDate,
      endDate          : formattedDate,
      ui_language      : uiLang,
      content_languages: contentLanguages
    };

    const { data } = yield call(Api.simpleMode, args);

    if (Array.isArray(data.lessons) && data.lessons.length > 0) {
      yield put(mbdActions.receiveCollections(data.lessons));
    }

    if (Array.isArray(data.others) && data.others.length > 0) {
      yield put(mbdActions.receiveContentUnits(data.others));
    }

    yield put(actions.fetchForDateSuccess(data));
  } catch (err) {
    yield put(actions.fetchForDateFailure(err));
  }
}

function* watchFetchForDate() {
  yield takeLatest(types['simpleMode/fetchForDate'], fetchForDate);
}

export const sagas = [
  watchFetchForDate
];

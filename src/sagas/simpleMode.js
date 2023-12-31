import { call, put, select, takeLatest } from 'redux-saga/effects';
import moment from 'moment';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/simpleMode';
import { actions as mbdActions } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';

export function* fetchForDate(action) {
  try {
    const { date }      = action.payload;
    const formattedDate = moment(date).format('YYYY-MM-DD');

    const uiLang           = yield select(state => settings.getUILang(state.settings));
    const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));

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

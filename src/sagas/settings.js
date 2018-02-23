import { put, takeLatest } from 'redux-saga/effects';
import moment from 'moment';

import { changeDirectionIfNeeded } from '../helpers/i18n-utils';
import { types } from '../redux/modules/settings';
import { actions as mdb } from '../redux/modules/mdb';
import i18n from '../helpers/i18nnext';

function* setLanguage(action) {
  const language = action.payload;

  // TODO (edo): promisify callback and check for errors
  i18n.changeLanguage(language);

  // change global moment.js locale
  moment.locale(language);

  // change page direction and fetch css

  // NOTE: yaniv -> edo (i18n object has a dir getter)
  // https://github.com/i18next/i18next/blob/master/src/i18next.js#L281
  changeDirectionIfNeeded(language);

  yield put(mdb.fetchSQData());
}

function* watchSetLanguages() {
  yield takeLatest([types.SET_LANGUAGE], setLanguage);
}

export const sagas = [
  watchSetLanguages,
];

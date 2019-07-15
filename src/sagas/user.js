import { select, takeLatest } from 'redux-saga/effects';
import { getLocation } from 'connected-react-router';

import userManager from '../helpers/usermanager';
import { types } from '../redux/modules/user';

export function* login(action) {

  const location = JSON.stringify(yield select(getLocation));
  try {
    yield userManager.signinSilent({ state: location });
  } catch (err) {
    yield userManager.signinRedirect({ state: location });
  }
}

function* watchLogin() {
  yield takeLatest(types.LOGIN, login);
}

export const sagas = [
  watchLogin
];

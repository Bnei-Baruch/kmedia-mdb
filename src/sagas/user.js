import { select, takeLatest } from 'redux-saga/effects';
import { getLocation } from 'connected-react-router';

import userManager from '../helpers/usermanager';
import { types } from '../redux/modules/user';

export function* login(action) {
  const location = JSON.stringify(yield select(getLocation));
  yield userManager.signinRedirect({ state: location });
}

export function* logout(action) {
  userManager.signoutRedirect();
}

function* watchLogin() {
  yield takeLatest(types.LOGIN, login);
}

function* watchLogout() {
  yield takeLatest(types.LOGOUT, logout);
}

export const sagas = [
  watchLogin,
  watchLogout,
];

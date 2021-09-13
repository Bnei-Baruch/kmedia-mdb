import { actions } from '../redux/modules/auth';
import { call, put, takeLatest } from 'redux-saga/effects';
import { types } from '../redux/modules/auth';
import { kc } from './helpers/keycklockManager';

export function* login() {
  try {
    yield call(kc().login);
  } catch (err) {
    yield put(actions.loginFailure(err));
  }
}

export function* logout() {
  try {
    yield call(kc().logout);
  } catch (err) {
    yield console.error('logout error', err);
  }
}

function* watchLogin() {
  yield takeLatest([types.LOGIN], login);
}

function* watchLogout() {
  yield takeLatest([types.LOGOUT], logout);
}

export const sagas = [
  watchLogin,
  watchLogout
];

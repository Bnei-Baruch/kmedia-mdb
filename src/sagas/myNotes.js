import { call, put, select, takeEvery } from 'redux-saga/effects';

import { actions, types } from '../redux/modules/myNotes';
import Api from '../helpers/Api';
import { selectors as authSelectors } from '../redux/modules/auth';
import { MY_NAMESPACE_NOTES } from '../helpers/consts';

function* fetch(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;
  const namespace = MY_NAMESPACE_NOTES;
  const params    = action.payload;
  try {
    const { data: { items = [] } } = yield call(Api.myNotes, params, token);
    yield put(actions.fetchSuccess({ namespace, items }));
  } catch (err) {
    yield put(actions.fetchFailure({ namespace, ...err }));
  }
}

function* add(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;
  const namespace = MY_NAMESPACE_NOTES;
  const params    = action.payload;
  try {
    const { data } = yield call(Api.myNotes, params, token, 'POST');
    yield put(actions.addSuccess({ namespace, item: data }));
  } catch (err) {
    console.log(err);
  }
}

function* edit(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;
  const namespace = MY_NAMESPACE_NOTES;
  const params    = action.payload;
  try {
    const { data } = yield call(Api.myNotes, params, token, 'PUT');
    yield put(actions.editSuccess({ namespace, item: data, changeItems: action.payload.changeItems }));
  } catch (err) {
    console.log(err);
  }
}

function* remove(action) {
  const token = yield select(state => authSelectors.getToken(state.auth));
  if (!token) return;

  const id = action.payload;
  try {
    yield call(Api.myNotes, { id }, token, 'DELETE');
    yield put(actions.removeSuccess(id));
  } catch (err) {
    console.log(err);
  }
}

//Watches
function* watchFetch() {
  yield takeEvery(types['myNotes/fetch'], fetch);
}

function* watchAdd() {
  yield takeEvery(types['myNotes/add'], add);
}

function* watchEdit() {
  yield takeEvery(['myNotes/edit'], edit);
}

function* watchRemove() {
  yield takeEvery(types['myNotes/remove'], remove);
}

export const sagas = [
  watchFetch,
  watchAdd,
  watchEdit,
  watchRemove,
];

import { call, put, select, takeEvery } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';

function* fetchUnit(action) {
  const id = action.payload;
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.unit, { id, language });
    yield put(actions.fetchUnitSuccess(id, data));
  } catch (err) {
    yield put(actions.fetchUnitFailure(id, err));
  }
}

function* fetchCollection(action) {
  const id = action.payload;
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collection, { id, language });
    yield put(actions.fetchCollectionSuccess(id, data));
  } catch (err) {
    yield put(actions.fetchCollectionFailure(id, err));
  }
}

function* watchFetchUnit() {
  yield takeEvery(types.FETCH_UNIT, fetchUnit);
}

function* watchFetchCollection() {
  yield takeEvery(types.FETCH_COLLECTION, fetchCollection);
}

export const sagas = [
  watchFetchUnit,
  watchFetchCollection,
];

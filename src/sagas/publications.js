import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { types as system } from '../redux/modules/system';
import { selectors as settings } from '../redux/modules/settings';
import { actions as mdbActions } from '../redux/modules/mdb';
import { actions, types } from '../redux/modules/publications';

function* fetchUnit(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.unit, { id: action.payload, language });
    yield put(mdbActions.receiveContentUnits([data]));
    yield put(actions.fetchUnitSuccess(action.payload));
  } catch (err) {
    yield put(actions.fetchUnitFailure(action.payload, err));
  }
}

function* fetchCollection(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collection, { id: action.payload, language });
    yield put(mdbActions.receiveCollections([data]));
    yield put(actions.fetchCollectionSuccess(action.payload));
  } catch (err) {
    yield put(actions.fetchCollectionFailure(action.payload, err));
  }
}

function* fetchPublishers(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.publishers, { language });
    yield put(actions.fetchPublishersSuccess(data));
  } catch (err) {
    yield put(actions.fetchPublishersFailure(err));
  }
}

function* watchFetchUnit() {
  yield takeEvery(types.FETCH_UNIT, fetchUnit);
}

function* watchFetchCollection() {
  yield takeLatest(types.FETCH_COLLECTION, fetchCollection);
}

function* watchFetchPublishers() {
  yield takeLatest([types.FETCH_PUBLISHERS, system.INIT], fetchPublishers);
}

export const sagas = [
  watchFetchUnit,
  watchFetchCollection,
  watchFetchPublishers,
];

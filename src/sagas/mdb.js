import { call, put, select, takeLatest } from 'redux-saga/effects';

import castArray from 'lodash/castArray';
import Api from '../api/Api';
import { actions, types } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';

function* fetchCollection(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const response = yield call(Api.collection, { id: action.payload.id, language });

    const collections = castArray(response);
    yield put(actions.receiveCollections(collections));
  } catch (err) {
    yield put(actions.fetchCollectionFailure(err));
  }
}

function* watchFetchCollection() {
  yield takeLatest(types.FETCH_COLLECTION, fetchCollection);
}

export const sagas = [
  watchFetchCollection
];

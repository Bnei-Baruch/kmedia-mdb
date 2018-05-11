import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_LESSONS_SERIES } from '../helpers/consts';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/series';
import { actions as mdbActions } from '../redux/modules/mdb';

export function* fetchAll(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collections, {
      ...action.payload,
      contentTypes: [CT_LESSONS_SERIES],
      language,
      pageNo: 1,
      pageSize: 1000, // NOTE: we need to get all, and the endpoint lets us fetch only with pagination,
      with_units: false,
    });
    yield put(mdbActions.receiveCollections(data.collections));
    yield put(actions.fetchAllSuccess(data));
  } catch (err) {
    yield put(actions.fetchAllFailure(err));
  }
}

function* watchFetchAll() {
  yield takeLatest(types.FETCH_ALL, fetchAll);
}

export const sagas = [
  watchFetchAll,
];

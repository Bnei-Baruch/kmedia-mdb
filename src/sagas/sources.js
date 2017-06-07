import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/sources';
import { SourcesApi } from '../api/Api';
import { types as system } from '../redux/modules/system';

function* fetchSources(action) {
  try {
    const resp = yield call(SourcesApi.all);
    yield put(actions.fetchSourcesSuccess(resp));
  } catch (err) {
    yield put(actions.fetchSourcesFailure(err));
  }
}

function* watchFetchSources() {
  yield takeLatest([types.FETCH_SOURCES, system.INIT], fetchSources);
}

export const sagas = [
  watchFetchSources,
];

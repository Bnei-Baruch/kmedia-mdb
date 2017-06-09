import { call, put, select, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/sources';
import { SourcesApi } from '../api/Api';
import { types as system } from '../redux/modules/system';
import { selectors as settings } from '../redux/modules/settings';

function* fetchSources(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    console.log(language);
    const resp = yield call(SourcesApi.all, { language });
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

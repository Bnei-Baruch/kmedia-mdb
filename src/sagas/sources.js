import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/sources';
import { types as system } from '../redux/modules/system';
import { selectors as settings } from '../redux/modules/settings';

function* fetchSources() {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const resp     = yield call(Api.sources, { language });
    yield put(actions.fetchSourcesSuccess(resp));
  } catch (err) {
    yield put(actions.fetchSourcesFailure(err));
  }
}

function* fetchContent(action) {
  const id = action.payload;

  try {
    const index = yield call(Api.sourceIdx, { id });
    yield put(actions.fetchContentSuccess({ id, index }));
  } catch (err) {
    yield put(actions.fetchContentFailure(action.payload, err));
  }
}

function* watchFetchSources() {
  yield takeLatest([types.FETCH_SOURCES, system.INIT], fetchSources);
}

function* watchFetchContent() {
  yield takeEvery(types.FETCH_CONTENT, fetchContent);
}

export const sagas = [
  watchFetchSources,
  watchFetchContent
];

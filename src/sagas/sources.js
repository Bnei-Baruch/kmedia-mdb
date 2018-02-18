import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/sources';
import { selectors as settings } from '../redux/modules/settings';

function* fetchSources() {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.sources, { language });
    yield put(actions.fetchSourcesSuccess(data));
  } catch (err) {
    yield put(actions.fetchSourcesFailure(err));
  }
}

function* fetchIndex(action) {
  const id = action.payload;

  try {
    const { data } = yield call(Api.sourceIdx, { id });
    yield put(actions.fetchIndexSuccess(id, data));
  } catch (err) {
    yield put(actions.fetchIndexFailure(id, err));
  }
}

function* fetchContent(action) {
  try {
    const { data } = yield call(Api.sourceContent, action.payload);
    yield put(actions.fetchContentSuccess(data));
  } catch (err) {
    yield put(actions.fetchContentFailure(err));
  }
}

function* watchFetchSources() {
  yield takeLatest(types.FETCH_SOURCES, fetchSources);
}

function* watchFetchIndex() {
  yield takeEvery(types.FETCH_INDEX, fetchIndex);
}

function* watchFetchContent() {
  yield takeLatest(types.FETCH_CONTENT, fetchContent);
}

export const sagas = [
  watchFetchSources,
  watchFetchIndex,
  watchFetchContent,
];

import { call, put, select, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/tags';
import { TagsApi } from '../api/Api';
import { types as system } from '../redux/modules/system';
import { selectors as settings } from '../redux/modules/settings';

function* fetchTags(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const resp = yield call(TagsApi.all, { language });
    yield put(actions.fetchTagsSuccess(resp));
  } catch (err) {
    yield put(actions.fetchTagsFailure(err));
  }
}

function* watchFetchTags() {
  yield takeLatest([types.FETCH_TAGS, system.INIT], fetchTags);
}

export const sagas = [
  watchFetchTags,
];

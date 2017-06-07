import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/tags';
import { TagsApi } from '../api/Api';
import { types as system } from '../redux/modules/system';

function* fetchTags(action) {
  try {
    const resp = yield call(TagsApi.all);
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

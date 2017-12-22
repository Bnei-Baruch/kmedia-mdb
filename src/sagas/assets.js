import { call, put, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/assets';

function* fetchImages(action) {
  const id = action.payload;

  try {
    const { data } = yield call(Api.unzipImages, {id});
    yield put(actions.fetchAssetSuccess(id, data));
  }
  catch (err) {
    yield put(actions.fetchAssetFailure(id, err));
  }
}

function* watchFetchImages() {
  yield takeLatest(types.FETCH_ASSET, fetchImages);
}

export const sagas = [
  watchFetchImages
];

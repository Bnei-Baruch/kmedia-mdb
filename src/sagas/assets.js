import { call, put, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/assets';

function* fetchImages(action) {
  try {
    const { data } = yield call(Api.unzipImages, { id: action.payload });
    yield put(actions.fetchAssetSuccess(data));
  }
  catch (err) {
    yield put(actions.fetchAssetFailure(err));
  }
}

function* watchFetchImages() {
  yield takeLatest(types.FETCH_ASSET, fetchImages);
}

export const sagas = [
  watchFetchImages
];

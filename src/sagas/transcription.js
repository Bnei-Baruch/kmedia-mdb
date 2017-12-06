import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/transcription';

function* fetchTranscription(action) {

  try {
    const { data } = yield call(Api.doc2Html, action.payload);
    yield put(actions.fetchTranscriptionSuccess(data));
  } catch (err) {
    yield put(actions.fetchTranscriptionFailure(err));
  }
}

function* watchFetchTranscription() {
  yield takeLatest([types.FETCH_TRANSCRIPTION], fetchTranscription);
}

export const sagas = [
  watchFetchTranscription,
];

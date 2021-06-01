import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_SONGS } from '../helpers/consts';
import { selectors as settings } from '../redux/modules/settings';
import { actions, types } from '../redux/modules/music';
import { actions as mdbActions } from '../redux/modules/mdb';

export function* fetchMusic(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collections, {
      contentTypes: CT_SONGS,
      language,
      pageNo: 1,
      pageSize: 1000, // NOTE: we need to get all data, and the endpoint lets us fetch only with pagination,
      with_units: false,
    });

    yield put(mdbActions.receiveCollections(data.collections));
    yield put(actions.fetchMusicSuccess(data.collections));
  } catch (err) {
    yield put(actions.fetchMusicFailure(err));
  }
}

function* watchFetchMusic() {
  yield takeLatest(types.FETCH_MUSIC, fetchMusic);
}

// function* watchSetTab() {
//   yield takeLatest(types.SET_TAB, setTab);
// }

export const sagas = [
  watchFetchMusic,
  // watchSetTab,
];

import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_VIDEO_PROGRAM } from '../helpers/consts';
import { isEmpty } from '../helpers/utils';
import { selectors as settings } from '../redux/modules/settings';
import { actions, selectors } from '../redux/modules/programs';
import { actions as mdbActions } from '../redux/modules/mdb';
import { types as lists } from '../redux/modules/lists';

function* fetchGenres() {
  const language = yield select(state => settings.getLanguage(state.settings));
  const { data } = yield call(Api.collections, {
    language,
    content_type: CT_VIDEO_PROGRAM,
    pageNo: 1,
    pageSize: 1000,
    with_units: false,
  });
  if (Array.isArray(data.collections)) {
    yield put(mdbActions.receiveCollections(data.collections));
    yield put(actions.receiveCollections(data.collections));
  }
}

function* fetchRecentlyUpdated() {
  const { data } = yield call(Api.recentlyUpdated);
  if (Array.isArray(data)) {
    yield put(actions.receiveRecentlyUpdated(data));
  }
}

function* fetchProgramsList(action) {
  if (action.payload.namespace === 'programs') {
    // fetch Genres if we don't have them
    const genresTree = yield select(state => selectors.getGenres(state.programs));
    if (isEmpty(genresTree)) {
      yield fork(fetchGenres);
    }

    // fetch recently_updated if we don't have them
    const recentlyUpdated = yield select(state => selectors.getRecentlyUpdated(state.programs));
    if (isEmpty(recentlyUpdated)) {
      yield fork(fetchRecentlyUpdated);
    }
  }
}

function* watchFetchList() {
  yield takeLatest(lists.FETCH_LIST, fetchProgramsList);
}

export const sagas = [
  watchFetchList,
];

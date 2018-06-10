import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_VIDEO_PROGRAM } from '../helpers/consts';
import { isEmpty } from '../helpers/utils';
import { selectors as settings } from '../redux/modules/settings';
import { actions, selectors } from '../redux/modules/programs';
import { actions as mdbActions } from '../redux/modules/mdb';
import { types as lists } from '../redux/modules/lists';

function* fetchProgramsList(action) {
  if (action.payload.namespace !== 'programs') {
    return;
  }

  // fetch once
  const programs = yield select(state => selectors.getPrograms(state.programs));
  if (!isEmpty(programs)) {
    return;
  }

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

function* watchFetchList() {
  yield takeLatest(lists.FETCH_LIST, fetchProgramsList);
}

export const sagas = [
  watchFetchList,
];

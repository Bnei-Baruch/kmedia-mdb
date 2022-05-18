import { call, put, select, takeLatest } from 'redux-saga/effects';

import { selectors as settings } from '../redux/modules/settings';
import { actions, selectors, types } from '../redux/modules/programs';
import { actions as mdbActions } from '../redux/modules/mdb';
import { types as listTypes } from '../redux/modules/lists';
import { setTab } from './helpers/url';
import Api from '../helpers/Api';
import { CT_CLIPS, CT_VIDEO_PROGRAM } from '../helpers/consts';
import { isEmpty } from '../helpers/utils';

function* fetchProgramsList() {
  try {
    // fetch once
    const programs = yield select(state => selectors.getProgramsByType(state.programs));

    if (!isEmpty(programs)) {
      return;
    }

    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collections, {
      language,
      content_type: [CT_VIDEO_PROGRAM, CT_CLIPS],
      pageNo: 1,
      pageSize: 1000,
      with_units: false,
    });

    if (Array.isArray(data.collections)) {
      yield put(mdbActions.receiveCollections(data.collections));
      yield put(actions.receiveCollections(data.collections));
    }
  } catch (err) {
    console.log('fetch programs error', err);
  }
}

function* watchFetchList() {
  yield takeLatest(types.FETCH_COLLECTIONS, fetchProgramsList);
}

export const sagas = [
  watchFetchList
];

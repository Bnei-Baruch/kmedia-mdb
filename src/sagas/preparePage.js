import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions as mdbActions } from '../redux/modules/mdb';
import { actions, selectors, types } from '../redux/modules/preparePage';
import { selectors as settings } from '../redux/modules/settings';

const DEF_PARAMS = { pageNo: 1, pageSize: 1000, with_units: false, };

function* fetchCollectionsList(action) {
  const { namespace, ...params } = action.payload;
  try {
    // fetch once
    const wasFetched = yield select(state => selectors.wasFetchedByNS(state.preparePage, namespace));

    if (wasFetched) return;

    const uiLang = yield select(state => settings.getUILang(state.settings));
    const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));
    const { data } = yield call(Api.collections, { ...DEF_PARAMS, ui_lang: uiLang, content_languages: contentLanguages, ...params });

    if (Array.isArray(data.collections)) {
      yield put(mdbActions.receiveCollections(data.collections));
      yield put(actions.receiveCollections(namespace));
    }
  } catch (err) {
    console.log('fetch programs error', err);
  }
}

function* watchFetchCollections() {
  yield takeLatest(types.FETCH_COLLECTIONS, fetchCollectionsList);
}

export const sagas = [
  watchFetchCollections
];

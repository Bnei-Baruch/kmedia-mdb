import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, selectors, types } from '../redux/modules/preparePage';
import { actions as mbdActions } from '../redux/modules/mdb';
import { settingsGetContentLanguagesSelector, settingsGetUILangSelector } from '../redux/selectors';

const DEF_PARAMS = { pageNo: 1, pageSize: 1000, with_units: false };

function* fetchCollectionsList(action) {
  const { namespace, ...params } = action.payload;
  try {
    // fetch once
    const wasFetched = yield select(state => selectors.wasFetchedByNS(state.preparePage, namespace));

    if (wasFetched) return;

    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const { data }         = yield call(Api.collections, { ...DEF_PARAMS, ui_language: uiLang, content_languages: contentLanguages, ...params });

    if (Array.isArray(data.collections)) {
      yield put(mbdActions.receiveCollections(data.collections));
      yield put(actions.receiveCollections(namespace));
    }
  } catch (err) {
    console.log('fetch programs error', err);
  }
}

function* watchFetchCollections() {
  yield takeLatest(types['preparePage/fetchCollections'], fetchCollectionsList);
}

export const sagas = [
  watchFetchCollections
];

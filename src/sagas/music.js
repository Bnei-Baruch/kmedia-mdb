import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_SONGS } from '../helpers/consts';
import { actions, types } from '../redux/modules/music';
import { actions as mbdActions } from '../redux/modules/mdb';
import { settingsGetContentLanguagesSelector, settingsGetUILangSelector } from '../redux/selectors';

export function* fetchMusic(action) {
  try {
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const { data }         = yield call(Api.collections, {
      content_type     : CT_SONGS,
      ui_language      : uiLang,
      content_languages: contentLanguages,
      pageNo           : 1,
      pageSize         : 1000, // NOTE: we need to get all data, and the endpoint lets us fetch only with pagination,
      with_units       : false
    });

    yield put(mbdActions.receiveCollections(data.collections));
    yield put(actions.fetchMusicSuccess(data.collections));
  } catch (err) {
    yield put(actions.fetchMusicFailure(err));
  }
}

function* watchFetchMusic() {
  yield takeLatest(types['music/fetchMusic'], fetchMusic);
}

export const sagas = [watchFetchMusic];

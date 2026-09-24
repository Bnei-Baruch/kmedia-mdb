import { call, put, select, takeEvery } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_LIKUTIM } from '../helpers/consts';
import { actions, types } from '../redux/modules/likutim';
import { actions as mdbActions } from '../redux/modules/mdb';
import { settingsGetContentLanguagesSelector, settingsGetUILangSelector } from '../redux/selectors';

function* fetchLikutimByTag(action) {
  const key = action.payload;

  const contentLanguages = yield select(settingsGetContentLanguagesSelector);
  const uiLang           = yield select(settingsGetUILangSelector);

  try {
    const params = {
      content_type: CT_LIKUTIM,
      ui_language: uiLang,
      content_languages: contentLanguages,
      page_size: 10000,
      tag: key.split('_'),
      with_tags: true,
      roots_only: true
    };

    const { data: { content_units } } = yield call(Api.units, params);

    yield put(mdbActions.receiveContentUnits(content_units));
    yield put(actions.fetchByTagSuccess({ content_units, key }));
  } catch (err) {
    yield put(actions.fetchByTagFailure({ err, key }));
  }
}

function* watchFetchLikutimByTagSuccess() {
  yield takeEvery(types['likutim/fetchByTag'], fetchLikutimByTag);
}

export const sagas = [watchFetchLikutimByTagSuccess];

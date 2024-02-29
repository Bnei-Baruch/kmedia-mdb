import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_LESSONS_SERIES } from '../helpers/consts';
import { actions, types } from '../redux/modules/lessons';
import { actions as mdbActions } from '../redux/modules/mdb';
import { settingsGetContentLanguagesSelector, settingsGetUILangSelector } from '../redux/selectors';

export function* fetchAllSeries(action) {
  try {
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const params           = { ...action.payload };
    // add default param with_units
    if (params.with_units === undefined) {
      params.with_units = false;
    }

    const { data } = yield call(Api.collections, {
      ...params,
      contentTypes     : [CT_LESSONS_SERIES],
      ui_language      : uiLang,
      content_languages: contentLanguages,
      pageNo           : 1,
      pageSize         : 1000 // NOTE: we need to get all, and the endpoint lets us fetch only with pagination,
    });
    yield put(mdbActions.receiveCollections(data.collections));
    yield put(actions.fetchAllSeriesSuccess(data));
  } catch (err) {
    yield put(actions.fetchAllSeriesFailure(err));
  }
}

function* watchFetchAllSeries() {
  yield takeLatest(types['lessons/fetchAllSeries'], fetchAllSeries);
}

export const sagas = [watchFetchAllSeries];

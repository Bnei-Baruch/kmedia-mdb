import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_LESSONS_SERIES, } from '../helpers/consts';
import { actions, types } from '../redux/modules/lessons';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';

export function* fetchAllSeries(action) {
  try {
    const uiLang = yield select(state => settings.getUILang(state.settings));
    const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));
    const params   = { ...action.payload };
    // add default param with_units
    if (params.with_units === undefined) {
      params.with_units = false;
    }

    const { data } = yield call(Api.collections, {
      ...params,
      contentTypes: [CT_LESSONS_SERIES],
      ui_language: uiLang,
      content_languages: contentLanguages,
      pageNo: 1,
      pageSize: 1000, // NOTE: we need to get all, and the endpoint lets us fetch only with pagination,
    });
    yield put(mdbActions.receiveCollections(data.collections));
    yield put(actions.fetchAllSeriesSuccess(data));
  } catch (err) {
    yield put(actions.fetchAllSeriesFailure(err));
  }
}

function* watchFetchAllSeries() {
  yield takeLatest(types.FETCH_ALL_SERIES, fetchAllSeries);
}

export const sagas = [watchFetchAllSeries];

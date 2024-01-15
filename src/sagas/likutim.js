import { call, put, takeLatest, select } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_LIKUTIM } from '../helpers/consts';
import { actions, types } from '../redux/modules/likutim';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { callUnitsStats } from './stats';
import { filtersTransformer } from '../filters';
import { actions as mbdActions } from '../redux/modules/mdb';
import { settingsGetContentLanguagesSelector, settingsGetUILangSelector } from '../redux/selectors';

function* fetchLikutim() {
  try {
    const namespace    = 'likutim';
    const filters      = yield select(state => filterSelectors.getFilters(state.filters, namespace));
    const filterParams = filtersTransformer.toApiParams(filters) || {};

    const pageSize         = 10000;
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const { data }         = yield call(Api.units, { content_type: CT_LIKUTIM, language: uiLang, pageSize, ...filterParams });

    if (Array.isArray(data.content_units)) {
      // get counts of filter data (Topics etc.)
      yield* callUnitsStats({ content_type: CT_LIKUTIM, content_languages: contentLanguages, ui_language: uiLang, pageSize }, namespace);

      yield put(mbdActions.receiveContentUnits(data.content_units));
      yield put(actions.fetchLikutimSuccess(data));
    }
  } catch (err) {
    yield put(actions.fetchLikutimFailure(err));
  }
}

function* watchFetchLikutim() {
  yield takeLatest(types['likutim/fetchLikutim'], fetchLikutim);
}

export const sagas = [watchFetchLikutim];

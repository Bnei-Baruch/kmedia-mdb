import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/tags';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';
import { fetchViewsByUIDs } from './recommended';
import { fetchCollectionsByIDs, fetchLabels, fetchUnitsByIDs } from './mdb';
import { settingsGetContentLanguagesSelector, settingsGetUILangSelector } from '../redux/selectors';

export function* fetchDashboard(action) {
  const { tag: id } = action.payload;

  try {
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);

    const filters      = yield select(state => filterSelectors.getFilters(state.filters, `topics_${id}`));
    const filterParams = filtersTransformer.toApiParams(filters) || {};

    const { data } = yield call(Api.tagDashboard, {
      ...action.payload,
      ...filterParams,
      ui_language      : uiLang,
      content_languages: contentLanguages
    });

    const { items, media_total, text_total } = data;

    const cuIDs    = items.map(x => x.content_unit_id);
    const cIDs     = items.map(x => x.collection_id).filter(x => !!x);
    const labelIDs = items.map(x => x.label_id).filter(x => !!x);
    const list     = items.map(({ content_unit_id, label_id, collection_id, is_text }) => ({
      cuID  : content_unit_id,
      cID   : collection_id,
      lID   : label_id,
      isText: is_text
    }));

    const requests = [];

    requests.push(fetchUnitsByIDs({ payload: { id: cuIDs } }));

    requests.push(fetchCollectionsByIDs({ payload: { id: cIDs } }));
    requests.push(fetchLabels({ payload: { id: labelIDs } }));
    requests.push(fetchViewsByUIDs(items.filter(x => !x.is_text).map(x => x.content_unit_id)));
    yield all(requests);

    yield put(actions.fetchDashboardSuccess({ items: list, mediaTotal: media_total, textTotal: text_total }));
  } catch (err) {
    yield put(actions.fetchDashboardFailure(id, err));
  }
}

function* watchFetchDashboard() {
  yield takeLatest(types['tags/fetchDashboard'], fetchDashboard);
}

export const sagas = [
  watchFetchDashboard
];

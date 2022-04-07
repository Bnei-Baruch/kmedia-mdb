import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/tags';
import { selectors as settings } from '../redux/modules/settings';
import { actions as mdb } from '../redux/modules/mdb';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';
import { fetchViewsByUIDs } from './recommended';

export function* fetchDashboard(action) {
  const { tag: id } = action.payload;

  try {
    const language = yield select(state => settings.getLanguage(state.settings));

    const filters      = yield select(state => filterSelectors.getFilters(state.filters, `topics_${id}`));
    const filterParams = filtersTransformer.toApiParams(filters) || {};

    const {
            data: {
              items,
              media_total,
              text_total
            }
          } = yield call(Api.tagDashboard, { ...action.payload, ...filterParams, language });

    const cuIDs    = items.map(x => x.content_unit_id);
    const labelIDs = items.map(x => x.label_id).filter(x => !!x);
    const list     = items.map(({ content_unit_id, label_id, is_text }) => ({
      cuID: content_unit_id,
      lID: label_id,
      isText: is_text
    }));

    yield put(mdb.fetchUnitsByIDs({ id: cuIDs }));
    yield put(mdb.fetchLabels({ id: labelIDs }));
    yield put(actions.fetchDashboardSuccess({ items: list, mediaTotal: media_total, textTotal: text_total }));
    yield fetchViewsByUIDs(items.filter(x => !x.is_text).map(x => x.content_unit_id));
  } catch (err) {
    yield put(actions.fetchDashboardFailure(id, err));
  }
}

function* watchFetchDashboard() {
  yield takeLatest(types.FETCH_DASHBOARD, fetchDashboard);
}

export const sagas = [
  watchFetchDashboard
];

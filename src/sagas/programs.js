import { call, put, select, takeLatest } from 'redux-saga/effects';

import { selectors as settings } from '../redux/modules/settings';
import { actions, selectors, types } from '../redux/modules/programs';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { selectors as listsSelectors, types as listTypes } from '../redux/modules/lists';
import { updateQuery } from './helpers/url';
import Api from '../helpers/Api';
import { CT_VIDEO_PROGRAM, CT_CLIPS } from '../helpers/consts';
import { isEmpty } from '../helpers/utils';
import { filtersTransformer } from '../filters';

function* fetchProgramsList(action) {
  if (action.payload.namespace !== 'programs-main' &&
    action.payload.namespace !== 'programs-clips') {
    return;
  }

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

function* setTab(action) {
  const tab       = action.payload;
  const namespace = `programs-${tab}`;
  const filters   = yield select(state => filterSelectors.getFilters(state.filters, namespace));
  const lists     = yield select(state => listsSelectors.getNamespaceState(state.lists, namespace));
  const q         = {
    page: lists.pageNo,
    ...filtersTransformer.toQueryParams(filters),
  };

  yield* updateQuery((query) => {
    const x = Object.assign(query, q);
    if (x.page === 1) {
      delete x.page;
    }
    return x;
  });
}

function* watchFetchList() {
  yield takeLatest(listTypes.FETCH_LIST, fetchProgramsList);
}

function* watchSetTab() {
  yield takeLatest(types.SET_TAB, setTab);
}

export const sagas = [
  watchFetchList,
  watchSetTab
];

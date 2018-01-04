import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_ARTICLE } from '../helpers/consts';
import { updateQuery } from './helpers/url';
import { types as system } from '../redux/modules/system';
import { selectors as settings } from '../redux/modules/settings';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { actions as mdbActions } from '../redux/modules/mdb';
import { actions, types } from '../redux/modules/publications';
import { filtersTransformer } from '../filters';

function* fetchList(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, 'publications'));
  const params  = filtersTransformer.toApiParams(filters) || {};
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const args     = {
      ...action.payload,
      ...params,
      language,
      content_type: [CT_ARTICLE]
    };

    const { data } = yield call(Api.units, args);

    if (Array.isArray(data.content_units)) {
      yield put(mdbActions.receiveContentUnits(data.content_units));
    }

    yield put(actions.fetchListSuccess(data));
  } catch (err) {
    yield put(actions.fetchListFailure(err));
  }
}

function* fetchCollectionList(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, 'publications-collection'));
  const params  = filtersTransformer.toApiParams(filters) || {};
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const args     = {
      ...action.payload,
      ...params,
      language,
    };

    const { data } = yield call(Api.units, args);

    if (Array.isArray(data.content_units)) {
      yield put(mdbActions.receiveContentUnits(data.content_units));
    }

    yield put(actions.fetchCollectionListSuccess(data));
  } catch (err) {
    yield put(actions.fetchCollectionListFailure(err));
  }
}

function* fetchUnit(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.unit, { id: action.payload, language });
    yield put(mdbActions.receiveContentUnits([data]));
    yield put(actions.fetchUnitSuccess(action.payload));
  } catch (err) {
    yield put(actions.fetchUnitFailure(action.payload, err));
  }
}

function* fetchCollection(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collection, { id: action.payload, language });
    yield put(mdbActions.receiveCollections([data]));
    yield put(actions.fetchCollectionSuccess(action.payload));
  } catch (err) {
    yield put(actions.fetchCollectionFailure(action.payload, err));
  }
}

function* fetchPublishers(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.publishers, { language });
    yield put(actions.fetchPublishersSuccess(data));
  } catch (err) {
    yield put(actions.fetchPublishersFailure(err));
  }
}

function* updatePageInQuery(action) {
  const page = action.payload > 1 ? action.payload : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

function* watchFetchList() {
  yield takeLatest(types.FETCH_LIST, fetchList);
}

function* watchFetchUnit() {
  yield takeEvery(types.FETCH_UNIT, fetchUnit);
}

function* watchFetchCollection() {
  yield takeLatest(types.FETCH_COLLECTION, fetchCollection);
}

function* watchFetchCollectionList() {
  yield takeEvery(types.FETCH_COLLECTION_LIST, fetchCollectionList);
}

function* watchFetchPublishers() {
  yield takeLatest([types.FETCH_PUBLISHERS, system.INIT], fetchPublishers);
}

function* watchSetPage() {
  yield takeLatest([types.SET_PAGE, types.SET_COLLECTION_PAGE], updatePageInQuery);
}

export const sagas = [
  watchFetchList,
  watchFetchUnit,
  watchFetchCollection,
  watchFetchCollectionList,
  watchFetchPublishers,
  watchSetPage,
];

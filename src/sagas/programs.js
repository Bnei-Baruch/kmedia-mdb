import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_VIDEO_PROGRAM, CT_VIDEO_PROGRAM_CHAPTER } from '../helpers/consts';
import { updateQuery } from './helpers/url';
import { isEmpty } from '../helpers/utils';
import { selectors as settings } from '../redux/modules/settings';
import { actions, selectors as progSelectors, types } from '../redux/modules/programs';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';

function* fetchProgramsList(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, 'programs'));
  const params  = filtersTransformer.toApiParams(filters);
  try {
    const language = yield select(state => settings.getLanguage(state.settings));

    // fetch Genres if we don't have them
    const genresTree = yield select(state => progSelectors.getGenres(state.programs));
    if (isEmpty(genresTree)) {
      const genres = yield call(Api.collections, {
        language,
        content_type: CT_VIDEO_PROGRAM,
        pageNo: 1,
        pageSize: 1000,
        with_units: false,
      });
      if (Array.isArray(genres.collections)) {
        yield put(mdbActions.receiveCollections(genres.collections));
        yield put(actions.receiveCollections(genres.collections));
      }
    }

    // fetch recently_updated if we don't have them
    const recentlyUpdated = yield select(state => progSelectors.getRecentlyUpdated(state.programs));
    if (isEmpty(recentlyUpdated)) {
      const resp = yield call(Api.recentlyUpdated);
      if (Array.isArray(resp)) {
        yield put(actions.receiveRecentlyUpdated(resp));
      }
    }

    const args = isEmpty(params) ?
      { ...action.payload, language, content_type: CT_VIDEO_PROGRAM_CHAPTER } :
      { ...action.payload, language, ...params, content_type: CT_VIDEO_PROGRAM_CHAPTER };

    const resp = yield call(Api.units, args);
    if (Array.isArray(resp.collections)) {
      yield put(mdbActions.receiveCollections(resp.collections));
    }
    if (Array.isArray(resp.content_units)) {
      yield put(mdbActions.receiveContentUnits(resp.content_units));
    }

    yield put(actions.fetchListSuccess(resp));
  } catch (err) {
    yield put(actions.fetchListFailure(err));
  }
}

function* fetchProgramChapter(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const response = yield call(Api.unit, { id: action.payload, language });
    yield put(mdbActions.receiveContentUnits([response]));
    yield put(actions.fetchProgramChapterSuccess(action.payload));
  } catch (err) {
    yield put(actions.fetchProgramChapterFailure(action.payload, err));
  }
}

function* fetchFullProgram(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const response = yield call(Api.collection, { id: action.payload, language });
    yield put(mdbActions.receiveCollections([response]));
    yield put(actions.fetchFullProgramSuccess(action.payload));
  } catch (err) {
    yield put(actions.fetchFullProgramFailure(action.payload, err));
  }
}

function* updatePageInQuery(action) {
  const page = action.payload > 1 ? action.payload : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

function* watchFetchList() {
  yield takeLatest(types.FETCH_LIST, fetchProgramsList);
}

function* watchFetchProgramChapter() {
  yield takeEvery(types.FETCH_PROGRAM_CHAPTER, fetchProgramChapter);
}

function* watchFetchFullProgram() {
  yield takeLatest(types.FETCH_FULL_PROGRAM, fetchFullProgram);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [
  watchFetchList,
  watchFetchProgramChapter,
  watchFetchFullProgram,
  watchSetPage,
];

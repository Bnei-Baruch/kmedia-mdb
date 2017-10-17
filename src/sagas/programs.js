import { call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_VIDEO_PROGRAM, CT_VIDEO_PROGRAM_CHAPTER } from '../helpers/consts';
import { updateQuery } from './helpers/url';
import { isEmpty } from '../helpers/utils';
import { selectors as settings } from '../redux/modules/settings';
import { actions, selectors, types } from '../redux/modules/programs';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';

function* fetchGenres() {
  const language = yield select(state => settings.getLanguage(state.settings));
  const genres   = yield call(Api.collections, {
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

function* fetchRecentlyUpdated() {
  const resp = yield call(Api.recentlyUpdated);
  if (Array.isArray(resp)) {
    yield put(actions.receiveRecentlyUpdated(resp));
  }
}

function* fetchList(action, filterName, successAction, failureAction) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, filterName));
  const params  = filtersTransformer.toApiParams(filters);
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const args     = isEmpty(params) ?
      { ...action.payload, language, content_type: CT_VIDEO_PROGRAM_CHAPTER } :
      { ...action.payload, language, ...params, content_type: CT_VIDEO_PROGRAM_CHAPTER };

    const resp = yield call(Api.units, args);
    if (action.payload.program) {
      resp.program = action.payload.program;
    }
    if (Array.isArray(resp.collections)) {
      yield put(mdbActions.receiveCollections(resp.collections));
    }
    if (Array.isArray(resp.content_units)) {
      yield put(mdbActions.receiveContentUnits(resp.content_units));
    }

    yield put(successAction(resp));
  } catch (err) {
    yield put(failureAction(err));
  }
}

function* fetchProgramsList(action) {
  // fetch Genres if we don't have them
  const genresTree = yield select(state => selectors.getGenres(state.programs));
  if (isEmpty(genresTree)) {
    yield fork(fetchGenres);
  }

  // fetch recently_updated if we don't have them
  const recentlyUpdated = yield select(state => selectors.getRecentlyUpdated(state.programs));
  if (isEmpty(recentlyUpdated)) {
    yield fork(fetchRecentlyUpdated);
  }
  yield fetchList(action, 'programs', actions.fetchListSuccess, actions.fetchListFailure);
}

function* fetchFullProgramList(action) {
  yield fetchList(action, 'full-program', actions.fetchFullProgramListSuccess, actions.fetchFullProgramListFailure);
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

function* watchFetchFullProgramList() {
  yield takeEvery(types.FETCH_FULL_PROGRAM_LIST, fetchFullProgramList);
}

function* watchSetPage() {
  yield takeLatest([types.SET_PAGE, types.SET_FULL_PROGRAM_PAGE], updatePageInQuery);
}

export const sagas = [
  watchFetchList,
  watchFetchProgramChapter,
  watchFetchFullProgram,
  watchFetchFullProgramList,
  watchSetPage,
];

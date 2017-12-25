import { call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_LECTURE, CT_CHILDREN_LESSON, CT_WOMEN_LESSON, CT_VIRTUAL_LESSON } from '../helpers/consts';
import { updateQuery } from './helpers/url';
import { isEmpty } from '../helpers/utils';
import { selectors as settings } from '../redux/modules/settings';
import { actions, selectors, types } from '../redux/modules/lectures';
import { actions as mdbActions } from '../redux/modules/mdb';


function* fetchList(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const args     = 
      { ...action.payload, language, content_type: [CT_LECTURE, CT_WOMEN_LESSON, CT_CHILDREN_LESSON, CT_VIRTUAL_LESSON] }

    const { data } = yield call(Api.units, args);

    if (Array.isArray(data.content_units)) {
      yield put(mdbActions.receiveContentUnits(data.content_units));
    }

    yield put(actions.fetchListSuccess(data));
  } catch (err) {
    yield put(actions.fetchListFailure(err));
  }
}

// function* fetchProgramsList(action) {
//   // fetch Genres if we don't have them
//   const genresTree = yield select(state => selectors.getGenres(state.programs));
//   if (isEmpty(genresTree)) {
//     yield fork(fetchGenres);
//   }

//   // fetch recently_updated if we don't have them
//   const recentlyUpdated = yield select(state => selectors.getRecentlyUpdated(state.programs));
//   if (isEmpty(recentlyUpdated)) {
//     yield fork(fetchRecentlyUpdated);
//   }

//   yield fetchList(action, 'programs', actions.fetchListSuccess, actions.fetchListFailure);
// }

// function* fetchFullProgramList(action) {
//   yield fetchList(action, 'full-program', actions.fetchFullProgramListSuccess, actions.fetchFullProgramListFailure);
// }

// function* fetchProgramChapter(action) {
//   try {
//     const language = yield select(state => settings.getLanguage(state.settings));
//     const { data } = yield call(Api.unit, { id: action.payload, language });
//     yield put(mdbActions.receiveContentUnits([data]));
//     yield put(actions.fetchProgramChapterSuccess(action.payload));
//   } catch (err) {
//     yield put(actions.fetchProgramChapterFailure(action.payload, err));
//   }
// }

// function* fetchFullProgram(action) {
//   try {
//     const language = yield select(state => settings.getLanguage(state.settings));
//     const { data } = yield call(Api.collection, { id: action.payload, language });
//     yield put(mdbActions.receiveCollections([data]));
//     yield put(actions.fetchFullProgramSuccess(action.payload));
//   } catch (err) {
//     yield put(actions.fetchFullProgramFailure(action.payload, err));
//   }
// }

// function* updatePageInQuery(action) {
//   const page = action.payload > 1 ? action.payload : null;
//   yield* updateQuery(query => Object.assign(query, { page }));
// }

function* watchFetchList() {
  yield takeLatest(types.FETCH_LIST, fetchList);
}

// function* watchFetchProgramChapter() {
//   yield takeEvery(types.FETCH_PROGRAM_CHAPTER, fetchProgramChapter);
// }

// function* watchFetchFullProgram() {
//   yield takeLatest(types.FETCH_FULL_PROGRAM, fetchFullProgram);
// }

// function* watchFetchFullProgramList() {
//   yield takeEvery(types.FETCH_FULL_PROGRAM_LIST, fetchFullProgramList);
// }

// function* watchSetPage() {
//   yield takeLatest([types.SET_PAGE, types.SET_FULL_PROGRAM_PAGE], updatePageInQuery);
// }

export const sagas = [
    watchFetchList
  // , watchFetchProgramChapter
  // , watchFetchFullProgram
  // , watchFetchFullProgramList
  // , watchSetPage
];

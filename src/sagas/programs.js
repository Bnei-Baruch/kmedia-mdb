import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { updateQuery } from './helpers/url';
import { selectors as settings } from '../redux/modules/settings';
import { actions, selectors as progSelectors, types } from '../redux/modules/programs';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';
import { CT_VIDEO_PROGRAM, CT_VIDEO_PROGRAM_CHAPTER } from '../helpers/consts';
import { isEmpty } from '../helpers/utils';

function* random(totalGenres) {
  while (true) {
    yield Math.floor(Math.random() * totalGenres);
  }
}

const getGenres = (genres, r) => {
  const g = [];
  for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
    const idx = r.next().value;
    g.push(genres[idx]);
  }
  return g;
};

const addGenres = (collection) => {
  const genres = [
    'genre 1',
    'genre 2',
    'genre 3',
    'genre 4',
    'genre 5',
    'genre 6',
  ];

  const r = random(6);

  Object.keys(collection).forEach((x) => {
    collection[x].genres = getGenres(genres, r);
  });
};

function* fetchProgramsList(action) {
  const filters = yield select(state => filterSelectors.getFilters(state.filters, 'programs'));
  const params  = filtersTransformer.toApiParams(filters);
  try {
    const language   = yield select(state => settings.getLanguage(state.settings));
    // Initialize Genres
    const genresTree = yield select(state => progSelectors.getGenres(state.programs));
    if (isEmpty(genresTree)) {
      const genres = yield call(Api.collections, { ...action.payload, language, content_type: CT_VIDEO_PROGRAM });
      if (Array.isArray(genres.collections)) {
        addGenres(genres.collections);
        yield put(mdbActions.receiveCollections(genres.collections));
        yield put(actions.fetchCollections(genres.collections));
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

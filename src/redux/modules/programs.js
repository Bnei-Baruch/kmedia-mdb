import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';

/* Types */

const SET_PAGE              = 'Programs/SET_PAGE';
const SET_FULL_PROGRAM_PAGE = 'Programs/SET_FULL_PROGRAM_PAGE';

const FETCH_LIST                      = 'Programs/FETCH_LIST';
const FETCH_LIST_SUCCESS              = 'Programs/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE              = 'Programs/FETCH_LIST_FAILURE';
const FETCH_PROGRAM_CHAPTER           = 'Program/FETCH_PROGRAM_CHAPTER';
const FETCH_PROGRAM_CHAPTER_SUCCESS   = 'Program/FETCH_PROGRAM_CHAPTER_SUCCESS';
const FETCH_PROGRAM_CHAPTER_FAILURE   = 'Program/FETCH_PROGRAM_CHAPTER_FAILURE';
const FETCH_FULL_PROGRAM              = 'Program/FETCH_FULL_PROGRAM';
const FETCH_FULL_PROGRAM_SUCCESS      = 'Program/FETCH_FULL_PROGRAM_SUCCESS';
const FETCH_FULL_PROGRAM_FAILURE      = 'Program/FETCH_FULL_PROGRAM_FAILURE';
const FETCH_FULL_PROGRAM_LIST         = 'Program/FETCH_FULL_PROGRAM_LIST';
const FETCH_FULL_PROGRAM_LIST_SUCCESS = 'Program/FETCH_FULL_PROGRAM_LIST_SUCCESS';
const FETCH_FULL_PROGRAM_LIST_FAILURE = 'Program/FETCH_FULL_PROGRAM_LIST_FAILURE';
const RECEIVE_COLLECTIONS             = 'Programs/RECEIVE_COLLECTIONS';
const RECEIVE_RECENTLY_UPDATED        = 'Programs/RECEIVE_RECENTLY_UPDATED';

export const types = {
  SET_PAGE,
  SET_FULL_PROGRAM_PAGE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
  FETCH_PROGRAM_CHAPTER,
  FETCH_PROGRAM_CHAPTER_SUCCESS,
  FETCH_PROGRAM_CHAPTER_FAILURE,
  FETCH_FULL_PROGRAM,
  FETCH_FULL_PROGRAM_SUCCESS,
  FETCH_FULL_PROGRAM_FAILURE,
  FETCH_FULL_PROGRAM_LIST,
  FETCH_FULL_PROGRAM_LIST_SUCCESS,
  FETCH_FULL_PROGRAM_LIST_FAILURE,
  RECEIVE_COLLECTIONS,
  RECEIVE_RECENTLY_UPDATED,
};

/* Actions */

const setPage                     = createAction(SET_PAGE);
const setFullProgramPage          = createAction(SET_FULL_PROGRAM_PAGE);
const fetchList                   = createAction(FETCH_LIST, ({ pageNo, language, pageSize }) => ({
  pageNo,
  language,
  pageSize,
}));
const fetchListSuccess            = createAction(FETCH_LIST_SUCCESS);
const fetchListFailure            = createAction(FETCH_LIST_FAILURE);
const fetchProgramChapter         = createAction(FETCH_PROGRAM_CHAPTER);
const fetchProgramChapterSuccess  = createAction(FETCH_PROGRAM_CHAPTER_SUCCESS);
const fetchProgramChapterFailure  = createAction(FETCH_PROGRAM_CHAPTER_FAILURE, (id, err) => ({ id, err }));
const fetchFullProgram            = createAction(FETCH_FULL_PROGRAM);
const fetchFullProgramSuccess     = createAction(FETCH_FULL_PROGRAM_SUCCESS);
const fetchFullProgramFailure     = createAction(FETCH_FULL_PROGRAM_FAILURE, (id, err) => ({ id, err }));
const fetchFullProgramList        = createAction(FETCH_FULL_PROGRAM_LIST, (pageNo, pageSize, language, id) => ({
  pageNo,
  pageSize,
  language,
  collection: id,
}));
const fetchFullProgramListSuccess = createAction(FETCH_FULL_PROGRAM_LIST_SUCCESS);
const fetchFullProgramListFailure = createAction(FETCH_FULL_PROGRAM_LIST_FAILURE);
const receiveCollections          = createAction(RECEIVE_COLLECTIONS);
const receiveRecentlyUpdated      = createAction(RECEIVE_RECENTLY_UPDATED);

export const actions = {
  setPage,
  setFullProgramPage,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
  fetchProgramChapter,
  fetchProgramChapterSuccess,
  fetchProgramChapterFailure,
  fetchFullProgram,
  fetchFullProgramSuccess,
  fetchFullProgramFailure,
  fetchFullProgramList,
  fetchFullProgramListSuccess,
  fetchFullProgramListFailure,
  receiveCollections,
  receiveRecentlyUpdated,
};

/* Reducer */

const initialState = {
  total: 0,
  pageNo: 1,
  items: [],
  fullPaging: {
    total: 0,
    pageNo: 1,
    items: [],
  },
  genres: [],
  programs: [],
  recentlyUpdated: [],
  wip: {
    list: false,
    fullList: false,
    chapters: {},
    fulls: {}
  },
  errors: {
    list: null,
    fullList: null,
    chapters: {},
    fulls: {}
  },
};

/**
 * Set the wip and errors part of the state
 * @param state
 * @param action
 * @returns {{wip: {}, errors: {}}}
 */
const setStatus = (state, action) => {
  const wip    = { ...state.wip };
  const errors = { ...state.errors };

  switch (action.type) {
  case FETCH_LIST:
    wip.list = true;
    break;
  case FETCH_PROGRAM_CHAPTER:
    wip.chapters = { ...wip.chapters, [action.payload]: true };
    break;
  case FETCH_FULL_PROGRAM:
    wip.fulls = { ...wip.fulls, [action.payload]: true };
    break;
  case FETCH_FULL_PROGRAM_LIST:
    wip.fullList = true;
    break;
  case FETCH_LIST_SUCCESS:
    wip.list    = false;
    errors.list = null;
    break;
  case FETCH_PROGRAM_CHAPTER_SUCCESS:
    wip.chapters    = { ...wip.chapters, [action.payload]: false };
    errors.chapters = { ...errors.chapters, [action.payload]: null };
    break;
  case FETCH_FULL_PROGRAM_SUCCESS:
    wip.fulls    = { ...wip.fulls, [action.payload]: false };
    errors.fulls = { ...errors.fulls, [action.payload]: null };
    break;
  case FETCH_FULL_PROGRAM_LIST_SUCCESS:
    wip.fullList    = false;
    errors.fullList = null;
    break;
  case FETCH_LIST_FAILURE:
    wip.list    = false;
    errors.list = action.payload;
    break;
  case FETCH_PROGRAM_CHAPTER_FAILURE:
    wip.chapters    = { ...wip.chapters, [action.payload.id]: false };
    errors.chapters = { ...errors.chapters, [action.payload.id]: action.payload.err };
    break;
  case FETCH_FULL_PROGRAM_FAILURE:
    wip.fulls    = { ...wip.fulls, [action.payload.id]: false };
    errors.fulls = { ...errors.fulls, [action.payload.id]: action.payload.err };
    break;
  case FETCH_FULL_PROGRAM_LIST_FAILURE:
    wip.fullList    = false;
    errors.fullList = action.payload;
    break;
  default:
    break;
  }

  return {
    ...state,
    wip,
    errors,
  };
};

const onFetchListSuccess = (state, action) => {
  const items = action.payload.collections || action.payload.content_units || [];
  return {
    ...state,
    total: action.payload.total,
    items: items.map(x => x.id),
  };
};

const onFetchFullProgramListSuccess = (state, action) => {
  const items = action.payload.collections || action.payload.content_units || [];
  return {
    ...state,
    fullPaging: {
      ...state.fullPaging,
      total: action.payload.total,
      items: items.map(x => x.id),
    }
  };
};

const onSetPage = (state, action) => (
  {
    ...state,
    pageNo: action.payload
  }
);

const onSetFullProgramPage = (state, action) => {
  return {
    ...state,
    fullPaging: {
      ...state.fullPaging,
      pageNo: action.payload
    }
  };
};

const onSetLanguage = state => (
  {
    ...state,
    items: [],
    fullPaging: {
      ...state.fullPaging,
      items: [],
    },
    genres: [],
    programs: [],
  }
);

const onReceiveCollections = (state, action) => {
  const genres = [...new Set(action.payload.map(x => x.genres).reduce(
    (acc, cur) => acc.concat(cur),
    []
  ))].sort();

  return {
    ...state,
    genres,
    programs: action.payload,
  };
};

const onReceiveRecentlyUpdated = (state, action) => {
  return {
    ...state,
    recentlyUpdated: action.payload
  };
};

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_LIST]: setStatus,
  [FETCH_LIST_SUCCESS]: (state, action) =>
    setStatus(onFetchListSuccess(state, action), action),
  [FETCH_LIST_FAILURE]: setStatus,
  [FETCH_PROGRAM_CHAPTER]: setStatus,
  [FETCH_PROGRAM_CHAPTER_SUCCESS]: setStatus,
  [FETCH_PROGRAM_CHAPTER_FAILURE]: setStatus,
  [FETCH_FULL_PROGRAM]: setStatus,
  [FETCH_FULL_PROGRAM_SUCCESS]: setStatus,
  [FETCH_FULL_PROGRAM_FAILURE]: setStatus,
  [FETCH_FULL_PROGRAM_LIST]: setStatus,
  [FETCH_FULL_PROGRAM_LIST_SUCCESS]: (state, action) =>
    setStatus(onFetchFullProgramListSuccess(state, action), action),
  [FETCH_FULL_PROGRAM_LIST_FAILURE]: setStatus,

  [SET_PAGE]: onSetPage,
  [SET_FULL_PROGRAM_PAGE]: onSetFullProgramPage,
  [RECEIVE_COLLECTIONS]: onReceiveCollections,
  [RECEIVE_RECENTLY_UPDATED]: onReceiveRecentlyUpdated,
}, initialState);

/* Selectors */

const getTotal           = state => state.total;
const getPageNo          = state => state.pageNo;
const getItems           = state => state.items;
const getFullPaging      = state => state.fullPaging;
const getWip             = state => state.wip;
const getErrors          = state => state.errors;
const getGenres          = state => state.genres;
const getPrograms        = state => state.programs;
const getRecentlyUpdated = state => state.recentlyUpdated;

export const selectors = {
  getTotal,
  getItems,
  getFullPaging,
  getPageNo,
  getWip,
  getErrors,
  getGenres,
  getPrograms,
  getRecentlyUpdated,
};

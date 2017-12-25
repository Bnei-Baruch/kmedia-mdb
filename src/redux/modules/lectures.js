import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';

/* Types */

const SET_PAGE              = 'Lectures/SET_PAGE';
const SET_FULL_LECTURE_PAGE = 'Lectures/SET_FULL_LECTURE_PAGE';

const FETCH_LIST                      = 'Lectures/FETCH_LIST';
const FETCH_LIST_SUCCESS              = 'Lectures/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE              = 'Lectures/FETCH_LIST_FAILURE';
const FETCH_LECTURE                   = 'Lecture/FETCH_LECTURE';
const FETCH_LECTURE_SUCCESS           = 'Lecture/FETCH_LECTURE_SUCCESS';
const FETCH_LECTURE_FAILURE           = 'Lecture/FETCH_LECTURE_FAILURE';
const FETCH_FULL_LECTURE              = 'Lecture/FETCH_FULL_Lecture';
const FETCH_FULL_LECTURE_SUCCESS      = 'Lecture/FETCH_FULL_LECTURE_SUCCESS';
const FETCH_FULL_LECTURE_FAILURE      = 'Lecture/FETCH_FULL_LECTURE_FAILURE';
const FETCH_FULL_LECTURE_LIST         = 'Lecture/FETCH_FULL_LECTURE_LIST';
const FETCH_FULL_LECTURE_LIST_SUCCESS = 'Lecture/FETCH_FULL_LECTURE_LIST_SUCCESS';
const FETCH_FULL_LECTURE_LIST_FAILURE = 'Lecture/FETCH_FULL_LECTURE_LIST_FAILURE';
const RECEIVE_COLLECTIONS             = 'Lectures/RECEIVE_COLLECTIONS';
const RECEIVE_RECENTLY_UPDATED        = 'Lectures/RECEIVE_RECENTLY_UPDATED';

export const types = {
  SET_PAGE,
  SET_FULL_LECTURE_PAGE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
  FETCH_LECTURE,
  FETCH_LECTURE_SUCCESS,
  FETCH_LECTURE_FAILURE,
  FETCH_FULL_LECTURE,
  FETCH_FULL_LECTURE_SUCCESS,
  FETCH_FULL_LECTURE_FAILURE,
  FETCH_FULL_LECTURE_LIST,
  FETCH_FULL_LECTURE_LIST_SUCCESS,
  FETCH_FULL_LECTURE_LIST_FAILURE,
  RECEIVE_COLLECTIONS,
  RECEIVE_RECENTLY_UPDATED,
};

/* Actions */

const setPage                     = createAction(SET_PAGE);
const setFullLecturePage          = createAction(SET_FULL_LECTURE_PAGE);
const fetchList                   = createAction(FETCH_LIST, ({ pageNo, language, pageSize }) => ({
  pageNo,
  language,
  pageSize,
}));
const fetchListSuccess            = createAction(FETCH_LIST_SUCCESS);
const fetchListFailure            = createAction(FETCH_LIST_FAILURE);
const fetchLecture                = createAction(FETCH_LECTURE);
const fetchLectureSuccess         = createAction(FETCH_LECTURE_SUCCESS);
const fetchLectureFailure         = createAction(FETCH_LECTURE_FAILURE, (id, err) => ({ id, err }));
const fetchFullLecture            = createAction(FETCH_FULL_LECTURE);
const fetchFullLectureSuccess     = createAction(FETCH_FULL_LECTURE_SUCCESS);
const fetchFullLectureFailure     = createAction(FETCH_FULL_LECTURE_FAILURE, (id, err) => ({ id, err }));
const fetchFullLectureList        = createAction(FETCH_FULL_LECTURE_LIST, (pageNo, pageSize, language, id) => ({
  pageNo,
  pageSize,
  language,
  Lecture: id,
}));
const fetchFullLectureListSuccess = createAction(FETCH_FULL_LECTURE_LIST_SUCCESS);
const fetchFullLectureListFailure = createAction(FETCH_FULL_LECTURE_LIST_FAILURE);
const receiveCollections          = createAction(RECEIVE_COLLECTIONS);
const receiveRecentlyUpdated      = createAction(RECEIVE_RECENTLY_UPDATED);

export const actions = {
  setPage,
  setFullLecturePage,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
  fetchLecture,
  fetchLectureSuccess,
  fetchLectureFailure,
  fetchFullLecture,
  fetchFullLectureSuccess,
  fetchFullLectureFailure,
  fetchFullLectureList,
  fetchFullLectureListSuccess,
  fetchFullLectureListFailure,
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
  Lectures: [],
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
  case FETCH_LECTURE:
    wip.chapters = { ...wip.chapters, [action.payload]: true };
    break;
  case FETCH_FULL_LECTURE:
    wip.fulls = { ...wip.fulls, [action.payload]: true };
    break;
  case FETCH_FULL_LECTURE_LIST:
    wip.fullList = true;
    break;
  case FETCH_LIST_SUCCESS:
    wip.list    = false;
    errors.list = null;
    break;
  case FETCH_LECTURE_SUCCESS:
    wip.chapters    = { ...wip.chapters, [action.payload]: false };
    errors.chapters = { ...errors.chapters, [action.payload]: null };
    break;
  case FETCH_FULL_LECTURE_SUCCESS:
    wip.fulls    = { ...wip.fulls, [action.payload]: false };
    errors.fulls = { ...errors.fulls, [action.payload]: null };
    break;
  case FETCH_FULL_LECTURE_LIST_SUCCESS:
    wip.fullList    = false;
    errors.fullList = null;
    break;
  case FETCH_LIST_FAILURE:
    wip.list    = false;
    errors.list = action.payload;
    break;
  case FETCH_LECTURE_FAILURE:
    wip.chapters    = { ...wip.chapters, [action.payload.id]: false };
    errors.chapters = { ...errors.chapters, [action.payload.id]: action.payload.err };
    break;
  case FETCH_FULL_LECTURE_FAILURE:
    wip.fulls    = { ...wip.fulls, [action.payload.id]: false };
    errors.fulls = { ...errors.fulls, [action.payload.id]: action.payload.err };
    break;
  case FETCH_FULL_LECTURE_LIST_FAILURE:
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

const onFetchFullLectureListSuccess = (state, action) => {
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

const onSetFullLecturePage = (state, action) => {
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
    Lectures: [],
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
    Lectures: action.payload,
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
  [FETCH_LECTURE_CHAPTER]: setStatus,
  [FETCH_LECTURE_CHAPTER_SUCCESS]: setStatus,
  [FETCH_LECTURE_CHAPTER_FAILURE]: setStatus,
  [FETCH_FULL_LECTURE]: setStatus,
  [FETCH_FULL_LECTURE_SUCCESS]: setStatus,
  [FETCH_FULL_LECTURE_FAILURE]: setStatus,
  [FETCH_FULL_LECTURE_LIST]: setStatus,
  [FETCH_FULL_LECTURE_LIST_SUCCESS]: (state, action) =>
    setStatus(onFetchFullLectureListSuccess(state, action), action),
  [FETCH_FULL_LECTURE_LIST_FAILURE]: setStatus,

  [SET_PAGE]: onSetPage,
  [SET_FULL_LECTURE_PAGE]: onSetFullLecturePage,
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
const getLectures        = state => state.Lectures;
const getRecentlyUpdated = state => state.recentlyUpdated;

export const selectors = {
  getTotal,
  getItems,
  getFullPaging,
  getPageNo,
  getWip,
  getErrors,
  getGenres,
  getLectures,
  getRecentlyUpdated,
};

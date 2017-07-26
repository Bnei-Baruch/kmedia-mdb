import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';

/* Types */

const SET_PAGE = 'Lessons/SET_PAGE';

const FETCH_LIST                = 'Lessons/FETCH_LIST';
const FETCH_LIST_SUCCESS        = 'Lessons/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE        = 'Lessons/FETCH_LIST_FAILURE';
const FETCH_LESSON_PART         = 'Lesson/FETCH_LESSON_PART';
const FETCH_LESSON_PART_SUCCESS = 'Lesson/FETCH_LESSON_PART_SUCCESS';
const FETCH_LESSON_PART_FAILURE = 'Lesson/FETCH_LESSON_PART_FAILURE';
const FETCH_FULL_LESSON         = 'Lesson/FETCH_FULL_LESSON';
const FETCH_FULL_LESSON_SUCCESS = 'Lesson/FETCH_FULL_LESSON_SUCCESS';
const FETCH_FULL_LESSON_FAILURE = 'Lesson/FETCH_FULL_LESSON_FAILURE';

export const types = {
  SET_PAGE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
  FETCH_LESSON_PART,
  FETCH_LESSON_PART_SUCCESS,
  FETCH_LESSON_PART_FAILURE,
  FETCH_FULL_LESSON,
  FETCH_FULL_LESSON_SUCCESS,
  FETCH_FULL_LESSON_FAILURE,
};

/* Actions */

const setPage                = createAction(SET_PAGE);
const fetchList              = createAction(FETCH_LIST, (pageNo, language, pageSize) => ({
  pageNo,
  language,
  pageSize
}));
const fetchListSuccess       = createAction(FETCH_LIST_SUCCESS);
const fetchListFailure       = createAction(FETCH_LIST_FAILURE);
const fetchLessonPart        = createAction(FETCH_LESSON_PART);
const fetchLessonPartSuccess = createAction(FETCH_LESSON_PART_SUCCESS);
const fetchLessonPartFailure = createAction(FETCH_LESSON_PART_FAILURE, (id, err) => ({ id, err }));
const fetchFullLesson        = createAction(FETCH_FULL_LESSON);
const fetchFullLessonSuccess = createAction(FETCH_FULL_LESSON_SUCCESS);
const fetchFullLessonFailure = createAction(FETCH_FULL_LESSON_FAILURE, (id, err) => ({ id, err }));

export const actions = {
  setPage,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
  fetchLessonPart,
  fetchLessonPartSuccess,
  fetchLessonPartFailure,
  fetchFullLesson,
  fetchFullLessonSuccess,
  fetchFullLessonFailure
};

/* Reducer */

const initialState = {
  total: 0,
  items: [],
  pageNo: 1,
  wip: {
    list: false,
    parts: {},
    fulls: {},
  },
  errors: {
    list: null,
    parts: {},
    fulls: {},
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
  case FETCH_LESSON_PART:
    wip.parts = { ...wip.parts, [action.payload]: true };
    break;
  case FETCH_FULL_LESSON:
    wip.fulls = { ...wip.fulls, [action.payload]: true };
    break;
  case FETCH_LIST_SUCCESS:
    wip.list    = false;
    errors.list = null;
    break;
  case FETCH_LESSON_PART_SUCCESS:
    wip.parts    = { ...wip.parts, [action.payload]: false };
    errors.parts = { ...errors.parts, [action.payload]: null };
    break;
  case FETCH_FULL_LESSON_SUCCESS:
    wip.fulls    = { ...wip.fulls, [action.payload]: false };
    errors.fulls = { ...errors.fulls, [action.payload]: null };
    break;
  case FETCH_LIST_FAILURE:
    wip.list    = false;
    errors.list = action.payload;
    break;
  case FETCH_LESSON_PART_FAILURE:
    wip.parts    = { ...wip.parts, [action.payload.id]: false };
    errors.parts = { ...errors.parts, [action.payload.id]: action.payload.err };
    break;
  case FETCH_FULL_LESSON_FAILURE:
    wip.fulls    = { ...wip.fulls, [action.payload.id]: false };
    errors.fulls = { ...errors.fulls, [action.payload.id]: action.payload.err };
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
    ...setStatus(state, action),
    total: action.payload.total,
    items: items.map(x => [x.id, x.content_type]),
  };
};

const onSetPage = (state, action) => (
  {
    ...state,
    pageNo: action.payload,
  }
);

const onSetLanguage = state => (
  {
    ...state,
    items: [],
  }
);

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_LIST]: setStatus,
  [FETCH_LIST_SUCCESS]: onFetchListSuccess,
  [FETCH_LIST_FAILURE]: setStatus,
  [FETCH_LESSON_PART]: setStatus,
  [FETCH_LESSON_PART_SUCCESS]: setStatus,
  [FETCH_LESSON_PART_FAILURE]: setStatus,
  [FETCH_FULL_LESSON]: setStatus,
  [FETCH_FULL_LESSON_SUCCESS]: setStatus,
  [FETCH_FULL_LESSON_FAILURE]: setStatus,

  [SET_PAGE]: onSetPage,
}, initialState);

/* Selectors */

const getTotal  = state => state.total;
const getItems  = state => state.items;
const getPageNo = state => state.pageNo;
const getWip = state => state.wip;
const getErrors = state => state.errors;

export const selectors = {
  getTotal,
  getItems,
  getPageNo,
  getWip,
  getErrors,
};

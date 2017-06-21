import { createAction, handleActions } from 'redux-actions';

/* Types */

const SET_PAGE = 'Lessons/SET_PAGE';

const FETCH_LIST           = 'Lessons/FETCH_LIST';
const FETCH_LIST_SUCCESS   = 'Lessons/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE   = 'Lessons/FETCH_LIST_FAILURE';
const FETCH_LESSON_PART    = 'Lesson/FETCH_LESSON_PART';
const FETCH_LESSON_PART_SUCCESS = 'Lesson/FETCH_LESSON_PART_SUCCESS';
const FETCH_LESSON_PART_FAILURE = 'Lesson/FETCH_LESSON_PART_FAILURE';
const FETCH_FULL_LESSON    = 'Lesson/FETCH_FULL_LESSON';
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

const setPage            = createAction(SET_PAGE);
const fetchList          = createAction(FETCH_LIST, (pageNo, language, pageSize) => ({ pageNo, language, pageSize }));
const fetchListSuccess   = createAction(FETCH_LIST_SUCCESS);
const fetchListFailure   = createAction(FETCH_LIST_FAILURE);
const fetchLessonPart        = createAction(FETCH_LESSON_PART);
const fetchLessonPartSuccess = createAction(FETCH_LESSON_PART_SUCCESS);
const fetchLessonPartFailure = createAction(FETCH_LESSON_PART_FAILURE);
const fetchFullLesson        = createAction(FETCH_FULL_LESSON, id => ({ id }));
const fetchFullLessonSuccess = createAction(FETCH_FULL_LESSON_SUCCESS);
const fetchFullLessonFailure = createAction(FETCH_FULL_LESSON_FAILURE);

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
  error: null
};

const onFetchListSuccess = (state, action) => {
  const items = action.payload.collections || action.payload.content_units || [];
  return {
    ...state,
    total: action.payload.total,
    items: items.map(x => [x.id, x.content_type]),
  };
};

const onSetPage = (state, action) => (
  {
    ...state,
    pageNo: action.payload
  }
);

export const reducer = handleActions({
  [FETCH_LIST_SUCCESS]: onFetchListSuccess,
  [SET_PAGE]: onSetPage,
}, initialState);

/* Selectors */

const getTotal  = state => state.total;
const getItems  = state => state.items;
const getPageNo = state => state.pageNo;

export const selectors = {
  getTotal,
  getItems,
  getPageNo,
};

import { createAction, handleActions } from 'redux-actions';

/* Types */

const SET_PAGE = 'Lessons/SET_PAGE';

const FETCH_LIST           = 'Lessons/FETCH_LIST';
const FETCH_LIST_SUCCESS   = 'Lessons/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE   = 'Lessons/FETCH_LIST_FAILURE';
const FETCH_LESSON         = 'Lesson/FETCH_LESSON';
const FETCH_LESSON_SUCCESS = 'Lesson/FETCH_LESSON_SUCCESS';
const FETCH_LESSON_FAILURE = 'Lesson/FETCH_LESSON_FAILURE';

export const types = {
  SET_PAGE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
  FETCH_LESSON,
  FETCH_LESSON_SUCCESS,
  FETCH_LESSON_FAILURE,
};

/* Actions */

const setPage            = createAction(SET_PAGE);
const fetchList          = createAction(FETCH_LIST, (pageNo, language, pageSize) => ({ pageNo, language, pageSize }));
const fetchListSuccess   = createAction(FETCH_LIST_SUCCESS);
const fetchListFailure   = createAction(FETCH_LIST_FAILURE);
const fetchLesson        = createAction(FETCH_LESSON);
const fetchLessonSuccess = createAction(FETCH_LESSON_SUCCESS);
const fetchLessonFailure = createAction(FETCH_LESSON_FAILURE);

export const actions = {
  setPage,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
  fetchLesson,
  fetchLessonSuccess,
  fetchLessonFailure,
};

/* Reducer */

const initialState = {
  total: 0,
  items: [],
  pageNo: 1,
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

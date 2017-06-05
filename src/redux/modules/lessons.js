import { createAction, handleActions } from 'redux-actions';

/* Types */

const FETCH_LIST           = 'Lessons/FETCH_LIST';
const FETCH_LIST_SUCCESS   = 'Lessons/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE   = 'Lessons/FETCH_LIST_FAILURE';
const FETCH_LESSON         = 'Lesson/FETCH_LESSON';
const FETCH_LESSON_SUCCESS = 'Lesson/FETCH_LESSON_SUCCESS';
const FETCH_LESSON_FAILURE = 'Lesson/FETCH_LESSON_FAILURE';

export const types = {
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
  FETCH_LESSON,
  FETCH_LESSON_SUCCESS,
  FETCH_LESSON_FAILURE,
};

/* Actions */

const fetchList          = createAction(FETCH_LIST, (pageNo, language, pageSize) => ({ pageNo, language, pageSize }));
const fetchListSuccess   = createAction(FETCH_LIST_SUCCESS);
const fetchListFailure   = createAction(FETCH_LIST_FAILURE);
const fetchLesson        = createAction(FETCH_LESSON);
const fetchLessonSuccess = createAction(FETCH_LESSON_SUCCESS);
const fetchLessonFailure = createAction(FETCH_LESSON_FAILURE);

export const actions = {
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
  lessons: [],
};

const _fetchListSuccess = (state, action) => {
  const items = action.payload.collections || action.payload.content_units || [];
  return {
    ...state,
    total: action.payload.total,
    lessons: items.map(x => [x.id, x.content_type]),
  };
};

export const reducer = handleActions({
  [FETCH_LIST_SUCCESS]: (state, action) => _fetchListSuccess(state, action),
}, initialState);

/* Selectors */

const getTotal   = state => state.total;
const getLessons = state => state.lessons;

export const selectors = {
  getTotal,
  getLessons,
};

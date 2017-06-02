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
  total    : 0,
  lessons  : [],
  lesson   : {},
  lesson_id: 0,
  byUnitId : {}
};

const _fetchListSuccess = (state, action) => {
  const collections = action.payload.collections;
  const newState    = {
    ...state,
    total  : action.payload.total,
    lessons: collections.map(lesson => lesson.id),
  };
  collections.forEach((element) => {
    newState.byUnitId[element.id] = element;
    element.content_units.forEach((cu) => {
      newState.byUnitId[cu.id] = cu;
    });
  });
  return newState;
};

const _fetchLessonSuccess = (state, action) => {
  const payload = action.payload;
  const lesson  = Object.assign({}, state.byUnitId[payload.id], payload);

  return {
    ...state,
    lesson_id: action.payload.id,
    lesson   : [...lesson],
  };
};
export const reducer      = handleActions({
  [FETCH_LIST_SUCCESS]  : (state, action) => _fetchListSuccess(state, action),
  [FETCH_LESSON_SUCCESS]: (state, action) => _fetchLessonSuccess(state, action),
}, initialState);

/* Selectors */

const getLessons = state => state.lessons.map(id => state.byUnitId[id]);
const getLesson  = state => state.byUnitId[state.lesson_id];

export const selectors = {
  getLessons,
  getLesson,
};

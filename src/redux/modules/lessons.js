import { createAction, handleActions } from 'redux-actions';

/* Types */

const FETCH_LIST         = 'Lessons/FETCH_LIST';
const FETCH_LIST_SUCCESS = 'Lessons/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE = 'Lessons/FETCH_LIST_FAILURE';

export const types = {
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
};

/* Actions */

const fetchList        = createAction(FETCH_LIST, (pageNo, language, pageSize) => ({ pageNo, language, pageSize }));
const fetchListSuccess = createAction(FETCH_LIST_SUCCESS);
const fetchListFailure = createAction(FETCH_LIST_FAILURE);

export const actions = {
  fetchList,
  fetchListSuccess,
  fetchListFailure,
};

/* Reducer */

const initialState = {
  total: 0,
  lessons: []
};

export const reducer = handleActions({
  [FETCH_LIST_SUCCESS]: (state, action) => ({
    ...state,
    total: action.payload.total,
    lessons: [...action.payload.collections],
  }),
}, initialState);

/* Selectors */

const getLessons = state => state.lessons;

export const selectors = {
  getLessons
};

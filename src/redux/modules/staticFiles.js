import { createAction, handleActions } from 'redux-actions';
import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const FETCH_STATIC         = 'Sources/FETCH_STATIC';
const FETCH_STATIC_SUCCESS = 'Sources/FETCH_STATIC_SUCCESS';
const FETCH_STATIC_FAILURE = 'Sources/FETCH_STATIC_FAILURE';

export const types = {
  FETCH_STATIC,
  FETCH_STATIC_SUCCESS,
  FETCH_STATIC_FAILURE,
};

/* Actions */

const fetchStatic        = createAction(FETCH_STATIC, id => ({ id }));
const fetchStaticSuccess = createAction(FETCH_STATIC_SUCCESS);
const fetchStaticFailure = createAction(FETCH_STATIC_FAILURE);

export const actions = {
  fetchStatic,
  fetchStaticSuccess,
  fetchStaticFailure,
};

/* Reducer */

const initialState = {
  content: {
    data: null,
    wip: false,
    err: null,
  },
  error: null,
};

const onSSRPrepare = state => ({
  ...initialState,
  error: state.error ? state.error.toString() : state.error,
  content: {
    ...state.content,
    err: state.content.err ? state.content.err.toString() : state.content.err,
  },
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [settings.SET_LANGUAGE]: () => initialState,

  [FETCH_STATIC]: state => ({
    ...state,
    content: { wip: true }
  }),

  [FETCH_STATIC_SUCCESS]: (state, action) => ({
    ...state,
    content: { data: action.payload, wip: false, err: null }
  }),

  [FETCH_STATIC_FAILURE]: (state, action) => {
    console.log(FETCH_STATIC_FAILURE, action.payload);
    return {
      ...state,
      content: { wip: false, err: action.payload }
    };
  },

}, initialState);

/* Selectors */

const getContent = state => state.content;

export const selectors = {
  getContent,
};

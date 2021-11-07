import { createAction, handleActions } from 'redux-actions';

/* Types */
const LOGIN         = 'Auth/LOGIN';
const LOGIN_SUCCESS = 'Auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'Auth/LOGIN_FAILURE';

const LOGOUT         = 'Auth/LOGOUT';
const LOGOUT_SUCCESS = 'Auth/LOGOUT_SUCCESS';
const UPDATE_TOKEN   = 'Auth/UPDATE_TOKEN';

export const types = { LOGIN, LOGIN_SUCCESS, LOGOUT_SUCCESS, LOGOUT };

/* Reducer */
const initialState = { user: null, token: null, error: null, isKcReady: false };

const onLoginSuccess = (draft, action) => {
  const { user, token } = action.payload;
  draft.user            = user;
  draft.token           = token;
  draft.error           = null;
  return draft;
};

const onLoginFailure = (draft, action) => {
  const { error } = action.payload;
  draft.user      = null;
  draft.token     = null;
  draft.error     = error;
  return draft;
};

const onLogoutSuccess = draft => {
  draft.user  = null;
  draft.token = null;
  draft.error = null;
  return draft;
};

const onUpdateToken = (draft, action) => {
  const { token } = action.payload;
  draft.token     = token;
  return draft;
};

export const reducer = handleActions({
  [LOGIN_SUCCESS]: onLoginSuccess,
  [LOGIN_FAILURE]: onLoginFailure,
  [LOGOUT_SUCCESS]: onLogoutSuccess,
  [UPDATE_TOKEN]: onUpdateToken,
}, initialState);

/* Actions */
const login        = createAction(LOGIN);
const loginSuccess = createAction(LOGIN_SUCCESS);
const loginFailure = createAction(LOGIN_FAILURE);

const logout        = createAction(LOGOUT);
const logoutSuccess = createAction(LOGOUT_SUCCESS);
const updateToken   = createAction(UPDATE_TOKEN);

export const actions = { login, loginSuccess, loginFailure, logout, logoutSuccess, updateToken };

/* Selectors */
const getUser          = state => state.user;
const getToken         = state => state.token;
export const selectors = { getUser, getToken };

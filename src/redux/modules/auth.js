import { createAction } from 'redux-actions';
import { handleActions } from './settings';

/* Types */
const UPDATE_USER  = 'Auth/UPDATE_USER';
const UPDATE_TOKEN = 'Auth/UPDATE_TOKEN';

export const types = { UPDATE_TOKEN, UPDATE_USER };

/* Reducer */
const initialState = { user: undefined, token: null };

const onUpdateUser  = (draft, payload) => {
  draft.user = payload;
  if (!payload) {
    draft.token = null;
  }
};
const onUpdateToken = (draft, payload) => {
  draft.token = payload;
  if (!payload) {
    draft.user = null;
  }
};

export const reducer = handleActions({
  [UPDATE_USER]: onUpdateUser,
  [UPDATE_TOKEN]: onUpdateToken,
}, initialState);

/* Actions */
const updateUser  = createAction(UPDATE_USER);
const updateToken = createAction(UPDATE_TOKEN);

export const actions = { updateUser, updateToken };

/* Selectors */
const getUser          = state => state.user;
const getToken         = state => state.token;
export const selectors = { getUser, getToken };

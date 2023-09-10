import { createSlice } from '@reduxjs/toolkit';

/* Reducer */
const initialState = { user: null, token: null };

const onUpdateUser = (draft, payload) => {
  draft.user = payload;
  if (!payload) {
    draft.token = null;
  }
};

const onUpdateToken        = (draft, payload) => {
  draft.token = payload;
  if (!payload) {
    draft.user = null;
  }
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: onUpdateUser,
    updateToken: onUpdateToken
  }
});

/* Selectors */
const getUser          = state => state.user;
const getToken         = state => state.token;
export const selectors = { getUser, getToken };

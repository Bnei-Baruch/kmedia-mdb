import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name        : 'auth',
  initialState: { user: undefined, token: null },

  reducers: {
    updateUser : (state, { payload }) => {
      state.user = payload;
      if (!payload) {
        state.token = null;
      }
    },
    updateToken: (state, { payload }) => {
      state.token = payload;
      if (!payload) {
        state.user = null;
      }
    }
  },

  selectors: {
    getUser : state => state.user,
    getToken: state => state.token
  }
});

export default authSlice.reducer;

export const { actions } = authSlice;

export const types = Object.fromEntries(new Map(
  Object.values(authSlice.actions).map(a => [a.type, a.type])
));

export const selectors = authSlice.getSelectors();

import { createAction, handleActions } from 'redux-actions';

/* Types */

const SET_TAB = 'Lectures/SET_TAB';

export const types = {
  SET_TAB,
};

/* Actions */

const setTab = createAction(SET_TAB);

export const actions = {
  setTab,
};

/* Reducer */

const initialState = {};

export const reducer = handleActions({}, initialState);

/* Selectors */

export const selectors = {};

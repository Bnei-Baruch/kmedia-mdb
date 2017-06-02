import { createAction, handleActions } from 'redux-actions';

/* Types */

const BOOT  = 'System/BOOT';
const INIT  = 'System/INIT';
const READY = 'System/READY';

export const types = {
  BOOT,
  INIT,
  READY
};

/* Actions */

const boot  = createAction(BOOT);
const init  = createAction(INIT);
const ready = createAction(READY);

export const actions = {
  boot,
  init,
  ready
};

/* Reducer */

const initialState = {
  isReady: false
};

export const reducer = handleActions({
  [READY]: state => ({
    ...state,
    isReady: true
  })
}, initialState);

/* Selectors */

const isReady = state => state.isReady;

export const selectors = {
  isReady
};

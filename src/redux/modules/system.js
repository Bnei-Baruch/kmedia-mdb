import { createAction, handleActions } from 'redux-actions';

/* Types */

const BOOT  = 'System/BOOT';
const INIT  = 'System/INIT';
const READY = 'System/READY';

export const types = {
  BOOT,
  INIT,
  READY,
};

/* Actions */

const boot  = createAction(BOOT);
const init  = createAction(INIT);
const ready = createAction(READY);

export const actions = {
  boot,
  init,
  ready,
};

/* Reducer */

const initialState = {
  isReady: false,
  deviceInfo: null,
  autoPlayAllowed: false,
  visibilityState: false
};

export const reducer = handleActions({
  [INIT]: (state, action) => ({
    ...state,
    deviceInfo: action.payload.deviceInfo,
    autoPlayAllowed: action.payload.autoPlayAllowed,
  }),

  [READY]: state => ({
    ...state,
    isReady: true
  }),
}, initialState);

/* Selectors */

const isReady            = state => state.isReady;
const getDeviceInfo      = state => state.deviceInfo;
const getAutoPlayAllowed = state => state.autoPlayAllowed;

export const selectors = {
  isReady,
  getDeviceInfo,
  getAutoPlayAllowed,
};


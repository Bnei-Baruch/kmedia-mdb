import { createAction, handleActions } from 'redux-actions';

/* Types */

const BOOT                     = 'System/BOOT';
const INIT                     = 'System/INIT';
const READY                    = 'System/READY';
const VISIBILIBY_STATE_CHANGED = 'System/VISIBILIBY_STATE_CHANGED';

export const types = {
  BOOT,
  INIT,
  READY,
  VISIBILIBY_STATE_CHANGED
};

/* Actions */

const boot                   = createAction(BOOT);
const init                   = createAction(INIT);
const ready                  = createAction(READY);
const visibilityStateChanged = createAction(VISIBILIBY_STATE_CHANGED);

export const actions = {
  boot,
  init,
  ready,
  visibilityStateChanged
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

  [VISIBILIBY_STATE_CHANGED]: (state, action) => ({
    ...state,
    visibilityState: action.payload === "hidden"
  })
}, initialState);

/* Selectors */

const isReady            = state => state.isReady;
const getDeviceInfo      = state => state.deviceInfo;
const getAutoPlayAllowed = state => state.autoPlayAllowed;
const getVisibilityState = state => state.visibilityState;

export const selectors = {
  isReady,
  getDeviceInfo,
  getAutoPlayAllowed,
  getVisibilityState
};


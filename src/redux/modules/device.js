import { createAction, handleActions } from 'redux-actions';

/* Types */

const SET_DEVICE_INFO       = 'Device/SET_DEVICE_INFO';
const SET_AUTO_PLAY_ALLOWED = 'Device/SET_AUTO_PLAY_ALLOWED';

export const types = {
  SET_DEVICE_INFO,
  SET_AUTO_PLAY_ALLOWED,
};

/* Actions */

const setDeviceInfo      = createAction(SET_DEVICE_INFO);
const setAutoPlayAllowed = createAction(SET_AUTO_PLAY_ALLOWED);

export const actions = {
  setDeviceInfo,
  setAutoPlayAllowed,
};

/* Reducer */

const initialState = {
  deviceInfo: null,
  autoPlayAllowed: false,
};

export const reducer = handleActions({
  [SET_DEVICE_INFO]: (state, action) => ({
    ...state,
    deviceInfo: action.payload,
  }),

  [SET_AUTO_PLAY_ALLOWED]: (state, action) => ({
    ...state,
    autoPlayAllowed: action.payload,
  }),

}, initialState);

/* Selectors */

const getDeviceInfo      = state => state.deviceInfo;
const getAutoPlayAllowed = state => state.autoPlayAllowed;

export const selectors = {
  getDeviceInfo,
  getAutoPlayAllowed,
};

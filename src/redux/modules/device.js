import { createAction } from 'redux-actions';

import { handleActions } from './settings';

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

const onSetDeviceInfo = (draft, payload) => {
  draft.deviceInfo = payload;
};

const onSetAutoPlayAllowed = (draft, payload) => {
  draft.autoPlayAllowed = payload;
};

export const reducer = handleActions({
  [SET_DEVICE_INFO]: onSetDeviceInfo,

  [SET_AUTO_PLAY_ALLOWED]: onSetAutoPlayAllowed,

}, initialState);

/* Selectors */

const getDeviceInfo      = state => state.deviceInfo;
const getAutoPlayAllowed = state => state.autoPlayAllowed;

export const selectors = {
  getDeviceInfo,
  getAutoPlayAllowed,
};

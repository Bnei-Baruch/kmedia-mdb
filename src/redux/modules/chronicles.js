import { createAction } from 'redux-actions';

import { types as authTypes } from './auth';
import { types as playerTypes } from './player';
import { handleActions } from './settings';

const USER_INACTIVE = 'USER_INACTIVE';

export const types = {
  USER_INACTIVE,
};

// Actions
const userInactive = createAction(USER_INACTIVE);

export const actions = {
  userInactive,
};

/* Reducer */
const initialState = {
  actionsCount: 0,
  lastAction: null,
  event: null
};

const onAction = (draft, payload) => {
  draft.actionsCount = draft.actionsCount + 1;
  draft.lastAction   = payload;
};

export const reducer = handleActions({
  'FETCH_RECOMMENDED_SUCCESS': onAction,
  'Search/AUTOCOMPLETE_SUCCESS': onAction,
  'Search/SEARCH_SUCCESS': onAction,

  [authTypes.LOGIN_SUCCESS]: onAction,
  [authTypes.LOGOUT_SUCCESS]: onAction,

  [playerTypes.PLAYER_PLAY]: draft => draft.event = 'player-play',
  [playerTypes.PLAYER_PAUSE]: draft => draft.event = 'player-stop',
  [playerTypes.PLAYER_DESTROY_PLUGIN]: draft => draft.event = 'player-stop',
  [playerTypes.PLAYER_MUTE_UNMUTE]: draft => draft.event = 'mute-unmute',

}, initialState);

const getLastAction = state => state.lastAction;
const getEvent      = state => state.event;

export const selectors = {
  getLastAction,
  getEvent
};

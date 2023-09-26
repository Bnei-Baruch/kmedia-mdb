import { createAction, handleActions } from 'redux-actions';
import { types as authTypes } from '../../../lib/redux/slices/authSlice/authSlice';
import { types as playerTypes } from '../../../lib/redux/slices/playerSlice/playerSlice';

const USER_INACTIVE         = 'USER_INACTIVE';
const PLAYER_PAUSE_ON_LEAVE = 'PLAYER_PAUSE_ON_LEAVE';

export const types = {
  USER_INACTIVE,
};

// Actions
const userInactive = createAction(USER_INACTIVE);
const pauseOnLeave = createAction(PLAYER_PAUSE_ON_LEAVE);

export const actions = {
  userInactive,
  pauseOnLeave
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
  return draft;
};

export const reducer = handleActions({
  'FETCH_RECOMMENDED_SUCCESS': onAction,
  'Search/AUTOCOMPLETE_SUCCESS': onAction,
  'Search/SEARCH_SUCCESS': onAction,

  //[authTypes.LOGIN_SUCCESS]: onAction,
  //[authTypes.LOGOUT_SUCCESS]: onAction,

  [playerTypes.PLAYER_PLAY]: draft => ({ ...draft, event: 'player-play' }),
  [playerTypes.PLAYER_PAUSE]: draft => ({ ...draft, event: 'player-stop' }),
  [playerTypes.PLAYER_REMOVE]: draft => ({ ...draft, event: 'player-stop' }),
  [PLAYER_PAUSE_ON_LEAVE]: draft => ({ ...draft, event: 'player-stop' }),
  [playerTypes.PLAYER_TOGGLE_MUTE]: draft => ({ ...draft, event: 'mute-unmute' }),

}, initialState);

const getLastAction = state => state.lastAction;
const getEvent      = state => state.event;

export const selectors = {
  getLastAction,
  getEvent
};

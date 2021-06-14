import { createAction, handleActions } from 'redux-actions';

const USER_INACTIVE = 'USER_INACTIVE';

export const types = {
  USER_INACTIVE,
}

// Actions
const userInactive = createAction(USER_INACTIVE);

export const actions = {
  userInactive,
};

/* Reducer */
const initialState = {
  actionsCount: 0,
  lastAction: null,
};

const onAction = (draft, payload) => {
  draft.actionsCount = draft.actionsCount + 1;
  draft.lastAction = payload;
  return draft;
};

export const reducer = handleActions({
  'FETCH_RECOMMENDED_SUCCESS': onAction,
}, initialState);

const getLastAction = state => state.lastAction;

export const selectors = {
  getLastAction,
}

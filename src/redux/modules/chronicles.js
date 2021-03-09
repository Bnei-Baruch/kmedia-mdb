import { createAction } from 'redux-actions';

const USER_INACTIVE = 'USER_INACTIVE';

export const types = {
  USER_INACTIVE,
}

// Actions
const userInactive = createAction(USER_INACTIVE);

export const actions = {
  userInactive,
};


import { createAction } from 'redux-actions';

const PREPARE = 'SSR/PREPARE';
const HYDRATE = 'SSR/HYDRATE';

export const types = {
  PREPARE,
  HYDRATE,
};

/* Actions */

const prepare = createAction(PREPARE);
const hydrate = createAction(HYDRATE);

export const actions = {
  prepare,
  hydrate,
};

import { createAction } from 'redux-actions';

import { handleActions } from './settings';

const TRIM         = 'Trim/TRIM';
const TRIM_SUCCESS = 'Trim/TRIM_SUCCESS';
const TRIM_FAILURE = 'Trim/TRIM_FAILURE';

export const types = {
  TRIM,
  TRIM_SUCCESS,
  TRIM_FAILURE,
};

/* Actions */
const trim        = createAction(TRIM);
const trimSuccess = createAction(TRIM_SUCCESS);
const trimFailure = createAction(TRIM_FAILURE);

export const actions = {
  trim,
  trimSuccess,
  trimFailure,
};

/* Reducer */

const initialState = {
  list: [],
  wips: [],
  errors: []
};

const onTrim = draft => {
  draft.wips.push(draft.wips.length);
  return draft;
};

const onTrimSuccess = (draft, { download, link }) => {
  draft.list.push({ download, link, name: link.split('/').slice(-1)[0] });
  draft.wips.pop();
  return draft;
};

const onTrimFailure = (draft, payload) => {
  draft.errors.push(payload);
  draft.wips.pop();
  return draft;
};

export const reducer = handleActions({
  [TRIM]: onTrim,
  [TRIM_SUCCESS]: onTrimSuccess,
  [TRIM_FAILURE]: onTrimFailure,
}, initialState);

/* Selectors */
const getList   = state => state.list;
const getWIPs   = state => state.wips;
const getErrors = state => state.errors;

export const selectors = {
  getList,
  getWIPs,
  getErrors,
};

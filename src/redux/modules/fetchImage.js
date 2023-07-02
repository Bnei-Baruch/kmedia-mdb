import { createAction } from 'redux-actions';

import { handleActions } from './settings';

const FETCH         = 'Image/FETCH';
const FETCH_SUCCESS = 'Image/FETCH_SUCCESS';
const FETCH_FAILURE = 'Image/FETCH_FAILURE';
const START_WIP     = 'Image/START_WIP';

export const types = { FETCH };

/* Actions */
const fetch        = createAction(FETCH, (src, fallbacks) => ({ src, fallbacks }));
const fetchSuccess = createAction(FETCH_SUCCESS);
const fetchFailure = createAction(FETCH_FAILURE);
const startWIP     = createAction(START_WIP);

export const actions = { fetch, fetchSuccess, fetchFailure, startWIP };

/* Reducer */

const initialState = { bySrc: {}, };

const onFetch        = (draft, { src }) => draft.bySrc[src] = { ...draft.bySrc[src], err: false };
const onFetchSuccess = (draft, { src, img }) => draft.bySrc[src] = { wip: false, err: false, src: img };
const onFetchFailure = (draft, { src, err }) => draft.bySrc[src] = { wip: false, err, src: 'default' };
const onStartWIP     = (draft, src) => draft.bySrc[src].wip = true;
export const reducer = handleActions({
  [FETCH]: onFetch,
  [FETCH_SUCCESS]: onFetchSuccess,
  [FETCH_FAILURE]: onFetchFailure,
  [START_WIP]: onStartWIP,
}, initialState);

/* Selectors */
const getBySrc = (state, src) => state.bySrc[src] || false;

export const selectors = { getBySrc };

import { createAction } from 'redux-actions';
import mapValues from 'lodash/mapValues';

import { handleActions, types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const SET_PAGE           = 'Lists/SET_PAGE';
const FETCH_LIST         = 'Lists/FETCH_LIST';
const FETCH_LIST_SUCCESS = 'Lists/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE = 'Lists/FETCH_LIST_FAILURE';

export const types = {
  SET_PAGE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
};

/* Actions */

const setPage          = createAction(SET_PAGE, (namespace, pageNo) => ({ namespace, pageNo }));
const fetchList        = createAction(FETCH_LIST,
  (namespace, pageNo, params = {}) => ({ namespace, pageNo, ...params, }));
const fetchListSuccess = createAction(FETCH_LIST_SUCCESS, (namespace, data) => ({ namespace, data }));
const fetchListFailure = createAction(FETCH_LIST_FAILURE, (namespace, err) => ({ namespace, err }));

export const actions = {
  setPage,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
};

/* Reducer */

const initialState = {};

const defaultNSvalue = { pageNo: 1, total: 0 };

const onSetPage = (draft, { namespace, pageNo }) => {
  if (draft[namespace] === undefined) {
    draft[namespace] = { ...defaultNSvalue };
  }

  draft[namespace].pageNo = pageNo;
};

const onRequest = (draft, { namespace }) => {
  if (draft[namespace] === undefined) {
    draft[namespace] = { ...defaultNSvalue };
  }

  draft[namespace].wip = true;
};

const onFailure = (draft, { namespace, err }) => {
  if (draft[namespace] === undefined) {
    draft[namespace] = { ...defaultNSvalue };
  }

  draft[namespace].wip = false;
  draft[namespace].err = err;
};

const onSuccess = (draft, { namespace, data }) => {
  const itemNormalizer = namespace === 'lessons-daily'
    ? x => [x.id, x.content_type]
    : x => x.id;
  if (draft[namespace] === undefined) {
    draft[namespace] = { ...defaultNSvalue };
  }

  draft[namespace].wip   = false;
  draft[namespace].err   = null;
  draft[namespace].total = data.total;
  draft[namespace].items = (data.collections || data.content_units || []).map(itemNormalizer);
};

const onSetLanguage = draft => (
  Object.keys(draft).reduce((acc, val) => {
    acc[val] = {
      pageNo: draft[val].pageNo,
      total: draft[val].total
    };
    return acc;
  }, {})
);

const onSSRPrepare = state => mapValues(state, x => ({ ...x, err: x.err ? x.err.toString() : x.err }));

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [SET_PAGE]: onSetPage,
  [FETCH_LIST]: onRequest,
  [FETCH_LIST_FAILURE]: onFailure,
  [FETCH_LIST_SUCCESS]: onSuccess,
}, initialState);

/* Selectors */

const getNamespaceState = (state, namespace) => state[namespace] || defaultNSvalue;

export const selectors = {
  getNamespaceState,
};

import { createAction, handleActions } from 'redux-actions';
import mapValues from 'lodash/mapValues';

import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const SET_PAGE              = 'Lists/SET_PAGE';
const FETCH_LIST            = 'Lists/FETCH_LIST';
const FETCH_LIST_SUCCESS    = 'Lists/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE    = 'Lists/FETCH_LIST_FAILURE';
const FETCH_INTENTS         = 'Lists/FETCH_INTENTS';
const FETCH_INTENTS_SUCCESS = 'Lists/FETCH_INTENTS_SUCCESS';
const FETCH_INTENTS_FAILURE = 'Lists/FETCH_INTENTS_FAILURE';

export const types = {
  SET_PAGE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
  FETCH_INTENTS,
  FETCH_INTENTS_SUCCESS,
  FETCH_INTENTS_FAILURE,
};

/* Actions */

const setPage             = createAction(SET_PAGE, (namespace, pageNo) => ({ namespace, pageNo }));
const fetchList           = createAction(FETCH_LIST,
  (namespace, pageNo, params = {}) => ({ namespace, pageNo, ...params, }));
const fetchListSuccess    = createAction(FETCH_LIST_SUCCESS, (namespace, data) => ({ namespace, data }));
const fetchListFailure    = createAction(FETCH_LIST_FAILURE, (namespace, err) => ({ namespace, err }));
const fetchIntents        = createAction(FETCH_INTENTS, (namespace, params = {}) => ({ namespace, params }));
const fetchIntentsSuccess = createAction(FETCH_INTENTS_SUCCESS, (namespace, data) => ({ namespace, data }));
const fetchIntentsFailure = createAction(FETCH_INTENTS_FAILURE, (namespace, err) => ({ namespace, err }));

export const actions = {
  setPage,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
  fetchIntents,
  fetchIntentsSuccess,
  fetchIntentsFailure,
};

/* Reducer */

const initialState = {};

const defaultNSvalue = { pageNo: 1, total: 0 };

const onSetPage = (state, action) => ({
  ...state,
  [action.payload.namespace]: ({
    ...(state[action.payload.namespace] || defaultNSvalue),
    pageNo: action.payload.pageNo,
  })
});

const onRequest = (state, action) => ({
  ...state,
  [action.payload.namespace]: ({
    ...(state[action.payload.namespace] || defaultNSvalue),
    wip: true,
  })
});

const onFailure = (state, action) => ({
  ...state,
  [action.payload.namespace]: ({
    ...(state[action.payload.namespace] || defaultNSvalue),
    wip: false,
    err: action.payload.err,
  })
});

const onSuccess = (state, action) => {
  const { namespace, data } = action.payload;
  const itemNormalizer      = namespace === 'lessons-daily' ?
    x => [x.id, x.content_type] :
    x => x.id;

  return {
    ...state,
    [namespace]: {
      ...(state[namespace] || defaultNSvalue),
      wip: false,
      err: null,
      total: data.total,
      items: (data.collections || data.content_units || []).map(itemNormalizer),
    }
  };
};

const onSetLanguage = state => (
  Object.keys(state).reduce((acc, val) => {
    acc[val] = {
      pageNo: state[val].pageNo,
      total: state[val].total
    };
    return acc;
  }, {})
);

const onSSRPrepare = state =>
  mapValues(state, x => ({ ...x, err: x.err ? x.err.toString() : x.err }));

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

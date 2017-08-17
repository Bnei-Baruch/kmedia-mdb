import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';

/* Types */

const SET_PAGE = 'Events/SET_PAGE';

const FETCH_LIST                    = 'Events/FETCH_LIST';
const FETCH_LIST_SUCCESS            = 'Events/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE            = 'Events/FETCH_LIST_FAILURE';
const FETCH_EVENT_ITEM         = 'Event/FETCH_EVENT_ITEM';
const FETCH_EVENT_ITEM_SUCCESS = 'Event/FETCH_EVENT_ITEM_SUCCESS';
const FETCH_EVENT_ITEM_FAILURE = 'Event/FETCH_EVENT_ITEM_FAILURE';
const FETCH_FULL_EVENT            = 'Event/FETCH_FULL_EVENT';
const FETCH_FULL_EVENT_SUCCESS    = 'Event/FETCH_FULL_EVENT_SUCCESS';
const FETCH_FULL_EVENT_FAILURE    = 'Event/FETCH_FULL_EVENT_FAILURE';

export const types = {
  SET_PAGE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
  FETCH_EVENT_ITEM,
  FETCH_EVENT_ITEM_SUCCESS,
  FETCH_EVENT_ITEM_FAILURE,
  FETCH_FULL_EVENT,
  FETCH_FULL_EVENT_SUCCESS,
  FETCH_FULL_EVENT_FAILURE,
};

/* Actions */

const setPage                    = createAction(SET_PAGE);
const fetchList                  = createAction(FETCH_LIST, (pageNo, language, pageSize, contentTypes) => ({
  contentTypes,
  pageNo,
  language,
  pageSize
}));
const fetchListSuccess           = createAction(FETCH_LIST_SUCCESS);
const fetchListFailure           = createAction(FETCH_LIST_FAILURE);
const fetchEventItem        = createAction(FETCH_EVENT_ITEM);
const fetchEventItemSuccess = createAction(FETCH_EVENT_ITEM_SUCCESS);
const fetchEventItemFailure = createAction(FETCH_EVENT_ITEM_FAILURE, (id, err) => ({ id, err }));
const fetchFullEvent           = createAction(FETCH_FULL_EVENT);
const fetchFullEventSuccess    = createAction(FETCH_FULL_EVENT_SUCCESS);
const fetchFullEventFailure    = createAction(FETCH_FULL_EVENT_FAILURE, (id, err) => ({ id, err }));

export const actions = {
  setPage,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
  fetchEventItem,
  fetchEventItemSuccess,
  fetchEventItemFailure,
  fetchFullEvent,
  fetchFullEventSuccess,
  fetchFullEventFailure,
};

/* Reducer */

const initialState = {
  total: 0,
  items: [],
  pageNo: 1,
  wip: {
    list: false,
    items: {},
    fulls: {}
  },
  errors: {
    list: null,
    items: {},
    fulls: {}
  },
};

/**
 * Set the wip and errors part of the state
 * @param state
 * @param action
 * @returns {{wip: {}, errors: {}}}
 */
const setStatus = (state, action) => {
  const wip    = { ...state.wip };
  const errors = { ...state.errors };

  switch (action.type) {
  case FETCH_LIST:
    wip.list = true;
    break;
  case FETCH_EVENT_ITEM:
    wip.items = { ...wip.items, [action.payload]: true };
    break;
  case FETCH_FULL_EVENT:
    wip.fulls = { ...wip.fulls, [action.payload]: true };
    break;
  case FETCH_LIST_SUCCESS:
    wip.list    = false;
    errors.list = null;
    break;
  case FETCH_EVENT_ITEM_SUCCESS:
    wip.items    = { ...wip.items, [action.payload]: false };
    errors.items = { ...errors.items, [action.payload]: null };
    break;
  case FETCH_FULL_EVENT_SUCCESS:
    wip.fulls    = { ...wip.fulls, [action.payload]: false };
    errors.fulls = { ...errors.fulls, [action.payload]: null };
    break;
  case FETCH_LIST_FAILURE:
    wip.list    = false;
    errors.list = action.payload;
    break;
  case FETCH_EVENT_ITEM_FAILURE:
    wip.items    = { ...wip.items, [action.payload.id]: false };
    errors.items = { ...errors.items, [action.payload.id]: action.payload.err };
    break;
  case FETCH_FULL_EVENT_FAILURE:
    wip.fulls    = { ...wip.fulls, [action.payload.id]: false };
    errors.fulls = { ...errors.fulls, [action.payload.id]: action.payload.err };
    break;
  default:
    break;
  }

  return {
    ...state,
    wip,
    errors,
  };
};

const onFetchListSuccess = (state, action) => {
  const items = action.payload.collections || action.payload.content_units || [];
  return {
    ...state,
    total: action.payload.total,
    items: items.map(x => [x.id, x.content_type]),
  };
};

const onSetPage = (state, action) => (
  {
    ...state,
    pageNo: action.payload
  }
);

const onSetLanguage = state => (
  {
    ...state,
    items: [],
  }
);

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_LIST]: setStatus,
  [FETCH_LIST_SUCCESS]: onFetchListSuccess,
  [FETCH_LIST_FAILURE]: setStatus,
  [FETCH_EVENT_ITEM]: setStatus,
  [FETCH_EVENT_ITEM_SUCCESS]: setStatus,
  [FETCH_EVENT_ITEM_FAILURE]: setStatus,
  [FETCH_FULL_EVENT]: setStatus,
  [FETCH_FULL_EVENT_SUCCESS]: setStatus,
  [FETCH_FULL_EVENT_FAILURE]: setStatus,

  [SET_PAGE]: onSetPage,
}, initialState);

/* Selectors */

const getTotal  = state => state.total;
const getItems  = state => state.items;
const getPageNo = state => state.pageNo;
const getWip    = state => state.wip;
const getErrors = state => state.errors;

export const selectors = {
  getTotal,
  getItems,
  getPageNo,
  getWip,
  getErrors,
};

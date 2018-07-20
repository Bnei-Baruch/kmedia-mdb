import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const SET_PAGE           = 'Blog/SET_PAGE';
const FETCH_LIST         = 'Blog/FETCH_LIST';
const FETCH_LIST_SUCCESS = 'Blog/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE = 'Blog/FETCH_LIST_FAILURE';
const FETCH_POST         = 'Blog/FETCH_POST';
const FETCH_POST_SUCCESS = 'Blog/FETCH_POST_SUCCESS';
const FETCH_POST_FAILURE = 'Blog/FETCH_POST_FAILURE';

export const types = {
  SET_PAGE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
  FETCH_POST,
  FETCH_POST_SUCCESS,
  FETCH_POST_FAILURE,
};

/* Actions */

const setPage          = createAction(SET_PAGE, (namespace, pageNo) => ({ pageNo }));
const fetchList        = createAction(FETCH_LIST,
  (namespace, pageNo, params = {}) => ({ namespace, pageNo, ...params, }));
const fetchListSuccess = createAction(FETCH_LIST_SUCCESS);
const fetchListFailure = createAction(FETCH_LIST_FAILURE);
const fetchPost        = createAction(FETCH_POST, (blog, id) => ({ blog, id }));
const fetchPostSuccess = createAction(FETCH_POST_SUCCESS);
const fetchPostFailure = createAction(FETCH_POST_FAILURE);

export const actions = {
  setPage,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
  fetchPost,
  fetchPostSuccess,
  fetchPostFailure,
};

/* Reducer */

const initialState = {
  byID: {},
  posts: [],
  total: 0,
  pageNo: 1,
  wip: false,
  err: null,
  wipPost: false,
  errPost: null,
};

const onSetLanguage = state => ({
  ...initialState,
  pageNo: state.pageNo,
  total: state.total,
});

const onSetPage = (state, action) => ({
  ...state,
  pageNo: action.payload.pageNo,
});

const onListSuccess = (state, action) => {
  const { total, posts } = action.payload;
  const { byID }         = state;

  const ids = [];
  posts.forEach((x) => {
    const k = `${x.blog}${x.wp_id}`;
    byID[k] = x;
    ids.push(k);
  });

  return {
    ...state,
    byID,
    total,
    posts: ids,
    wip: false,
    err: null,
  };
};

const onListFailure = (state, action) => ({
  ...state,
  posts: [],
  total: 0,
  wip: false,
  err: action.payload
});

const onPostSuccess = (state, action) => {
  const { blog, wp_id: id } = action.payload;
  const { byID }            = state;

  byID[`${blog}${id}`] = action.payload;

  return {
    ...state,
    byID,
    wipPost: false,
    errPost: null,
  };
};

const onPostFailure = (state, action) => ({
  ...state,
  wipPost: false,
  errPost: action.payload
});

const onSSRPrepare = state => ({
  ...state,
  err: state.err ? state.err.toString() : state.err,
  errPost: state.errPost ? state.errPost.toString() : state.errPost,
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [SET_PAGE]: onSetPage,
  [FETCH_LIST]: state => ({ ...state, wip: true }),
  [FETCH_LIST_SUCCESS]: onListSuccess,
  [FETCH_LIST_FAILURE]: onListFailure,
  [FETCH_POST]: state => ({ ...state, wipPost: true }),
  [FETCH_POST_SUCCESS]: onPostSuccess,
  [FETCH_POST_FAILURE]: onPostFailure,
}, initialState);

/* Selectors */

const getPost      = (state, blog, id) => state.byID[`${blog}${id}`];
const getPosts     = state => state.posts.map(x => state.byID[x]);
const getTotal     = state => state.total;
const getPageNo    = state => state.pageNo;
const getWip       = state => state.wip;
const getError     = state => state.err;
const getWipPost   = state => state.wipPost;
const getErrorPost = state => state.errPost;

export const selectors = {
  getPost,
  getPosts,
  getTotal,
  getPageNo,
  getWip,
  getError,
  getWipPost,
  getErrorPost,
};

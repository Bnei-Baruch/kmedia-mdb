import { createAction } from 'redux-actions';

import { handleActions, types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const SET_TAB            = 'Publications/SET_TAB';
const SET_PAGE           = 'Publications/SET_PAGE';
const RECEIVE_PUBLISHERS = 'Publications/RECEIVE_PUBLISHERS';

const FETCH_TWEETS         = 'Publications/FETCH_TWEETS';
const FETCH_TWEETS_SUCCESS = 'Publications/FETCH_TWEETS_SUCCESS';
const FETCH_TWEETS_FAILURE = 'Publications/FETCH_TWEETS_FAILURE';

const FETCH_BLOG_LIST         = 'Publications/FETCH_BLOG_LIST';
const FETCH_BLOG_LIST_SUCCESS = 'Publications/FETCH_BLOG_LIST_SUCCESS';
const FETCH_BLOG_LIST_FAILURE = 'Publications/FETCH_BLOG_LIST_FAILURE';
const FETCH_BLOG_POST         = 'Publications/FETCH_BLOG_POST';
const FETCH_BLOG_POST_SUCCESS = 'Publications/FETCH_BLOG_POST_SUCCESS';
const FETCH_BLOG_POST_FAILURE = 'Publications/FETCH_BLOG_POST_FAILURE';

export const types = {
  SET_TAB,
  SET_PAGE,
  RECEIVE_PUBLISHERS,

  FETCH_TWEETS,
  FETCH_TWEETS_SUCCESS,
  FETCH_TWEETS_FAILURE,

  FETCH_BLOG_LIST,
  FETCH_BLOG_LIST_SUCCESS,
  FETCH_BLOG_LIST_FAILURE,
  FETCH_BLOG_POST,
  FETCH_BLOG_POST_SUCCESS,
  FETCH_BLOG_POST_FAILURE,
};

/* Actions */

const setTab            = createAction(SET_TAB);
const setPage           = createAction(SET_PAGE, (namespace, pageNo) => ({ namespace, pageNo }));
const receivePublishers = createAction(RECEIVE_PUBLISHERS);

const fetchTweets        = createAction(FETCH_TWEETS,
  (namespace, pageNo, params = {}) => ({ namespace, pageNo, ...params, }));
const fetchTweetsSuccess = createAction(FETCH_TWEETS_SUCCESS);
const fetchTweetsFailure = createAction(FETCH_TWEETS_FAILURE);

const fetchBlogList        = createAction(FETCH_BLOG_LIST,
  (namespace, pageNo, params = {}) => ({ namespace, pageNo, ...params, }));
const fetchBlogListSuccess = createAction(FETCH_BLOG_LIST_SUCCESS);
const fetchBlogListFailure = createAction(FETCH_BLOG_LIST_FAILURE);
const fetchBlogPost        = createAction(FETCH_BLOG_POST, (blog, id) => ({ blog, id }));
const fetchBlogPostSuccess = createAction(FETCH_BLOG_POST_SUCCESS);
const fetchBlogPostFailure = createAction(FETCH_BLOG_POST_FAILURE);

export const actions = {
  setTab,
  setPage,
  receivePublishers,

  fetchTweets,
  fetchTweetsSuccess,
  fetchTweetsFailure,

  fetchBlogList,
  fetchBlogListSuccess,
  fetchBlogListFailure,
  fetchBlogPost,
  fetchBlogPostSuccess,
  fetchBlogPostFailure,
};

/* Reducer */

const initialState = {
  publishers: {
    byID: {},
  },
  twitter: {
    tweets: [],
    pageNo: 1,
    total: 0,
    wip: false,
    err: null,
  },
  blog: {
    byID: {},
    posts: [],
    total: 0,
    pageNo: 1,
    wip: false,
    err: null,
    wipPost: false,
    errPost: null,
  },
};

const onSetPage = (draft, { namespace, pageNo }) => {
  const ns         = namespace.split('-')[1];
  draft[ns].pageNo = pageNo;
};

const onReceivePublishers = (draft, payload) => {
  draft.publishers.byID = payload.reduce((acc, val) => {
    acc[val.id] = val;
    return acc;
  }, {});
};

const onFetchTweets = draft => {
  draft.twitter.wip = true;
};

const onFetchTweetsSuccess = (draft, payload) => {
  draft.twitter.total  = payload.total;
  draft.twitter.tweets = payload.tweets;
  draft.twitter.wip    = false;
};

const onFetchTweetsFailure = (draft, payload) => {
  draft.twitter.wip = false;
  draft.twitter.err = payload;
};

const onFetchBlogList = draft => {
  draft.blog.wip = true;
};

const onFetchBlogListSuccess = (draft, { total, posts }) => {
  const { blog } = draft;
  const byID     = blog.byID;
  let blogPosts  = blog.posts;

  blogPosts.length = 0;
  posts.forEach((x) => {
    const k = `${x.blog}${x.wp_id}`;
    byID[k] = x;
    blogPosts.push(k);
  });
  blog.total = total;
  blog.wip   = false;
  blog.err   = null;
};

const onFetchBlogListFailure = (draft, payload) => {
  draft.blog.wip = false;
  draft.blog.err = payload;
};

const onFetchBlogPost = draft => {
  draft.blog.wipPost = true;
};

const onFetchBlogPostSuccess = (draft, payload) => {
  const { blog: { byID } }  = draft;
  const { blog, wp_id: id } = payload;

  byID[`${blog}${id}`] = { ...payload };
  blog.wipPost         = false;
  blog.errPost         = null;
};

const onFetchBlogPostFailure = (draft, payload) => {
  draft.blog.wipPost = false;
  draft.blog.errPost = payload;
};

const onSetLanguage = draft => {
  draft.publishers.byID = {};

  let pageNo           = draft.twitter.pageNo;
  let total            = draft.twitter.total;
  draft.twitter        = { ...initialState.twitter };
  draft.twitter.pageNo = pageNo;
  draft.twitter.total  = total;

  pageNo            = draft.blog.pageNo;
  total             = draft.blog.total;
  draft.blog        = { ...initialState.blog };
  draft.blog.pageNo = pageNo;
  draft.blog.total  = total;
};

const onSSRPrepare = draft => {
  if (draft.twitter.err) {
    draft.twitter.err = draft.twitter.err.toString();
  }
  if (draft.blog.err) {
    draft.blog.err = draft.blog.err.toString();
  }
  if (draft.blog.errPost) {
    draft.blog.errPost = draft.blog.errPost.toString();
  }
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [SET_PAGE]: onSetPage,
  [RECEIVE_PUBLISHERS]: onReceivePublishers,

  [FETCH_TWEETS]: onFetchTweets,
  [FETCH_TWEETS_SUCCESS]: onFetchTweetsSuccess,
  [FETCH_TWEETS_FAILURE]: onFetchTweetsFailure,

  [FETCH_BLOG_LIST]: onFetchBlogList,
  [FETCH_BLOG_LIST_SUCCESS]: onFetchBlogListSuccess,
  [FETCH_BLOG_LIST_FAILURE]: onFetchBlogListFailure,
  [FETCH_BLOG_POST]: onFetchBlogPost,
  [FETCH_BLOG_POST_SUCCESS]: onFetchBlogPostSuccess,
  [FETCH_BLOG_POST_FAILURE]: onFetchBlogPostFailure,
}, initialState);

/* Selectors */

const getPublisherById = state => state.publishers.byID;

const getTweets       = state => state.twitter.tweets;
const getTweetsTotal  = state => state.twitter.total;
const getTweetsPageNo = state => state.twitter.pageNo;
const getTweetsWip    = state => state.twitter.wip;
const getTweetsError  = state => state.twitter.err;

const getBlogPost      = (state, blog, id) => state.blog.byID[`${blog}${id}`];
const getBlogPosts     = state => state.blog.posts.map(x => state.blog.byID[x]);
const getBlogTotal     = state => state.blog.total;
const getBlogPageNo    = state => state.blog.pageNo;
const getBlogWip       = state => state.blog.wip;
const getBlogError     = state => state.blog.err;
const getBlogWipPost   = state => state.blog.wipPost;
const getBlogErrorPost = state => state.blog.errPost;

export const selectors = {
  getPublisherById,

  getTweets,
  getTweetsTotal,
  getTweetsPageNo,
  getTweetsWip,
  getTweetsError,

  getBlogPost,
  getBlogPosts,
  getBlogTotal,
  getBlogPageNo,
  getBlogWip,
  getBlogError,
  getBlogWipPost,
  getBlogErrorPost,
};

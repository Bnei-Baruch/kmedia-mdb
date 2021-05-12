import { createAction } from 'redux-actions';

import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import { handleActions, types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const SET_TAB            = 'Publications/SET_TAB';
const SET_PAGE           = 'Publications/SET_PAGE';
const RECEIVE_PUBLISHERS = 'Publications/RECEIVE_PUBLISHERS';
const FETCH_COLLECTIONS  = 'Publications/FETCH_COLLECTIONS';

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
  FETCH_COLLECTIONS,

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
const fetchCollections  = createAction(FETCH_COLLECTIONS);

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
  fetchCollections,

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
  collections: {},
  twitter: {
    byID: {},
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

const onFetchCollections = (draft, payload) => {
  draft.collections = mapValues(groupBy(payload, x => x.content_type), x => x.map(y => y.id));
};

const onFetchTweets = draft => {
  draft.twitter.wip = true;
};

const onFetchTweetsSuccess = (draft, { tweets = [], total }) => {
  const { twitter } = draft;

  twitter.tweets.length = 0;
  tweets.forEach((x) => {
    twitter.byID[x.twitter_id] = x;
    twitter.tweets.push(x);
  });
  twitter.wip   = false;
  twitter.total = total;
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
  const { byID } = blog;
  const blogPosts  = blog.posts;

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
  const { blog, wp_id: id } = payload;

  draft.blog.byID[`${blog}${id}`] = payload;
  draft.blog.wipPost              = false;
  draft.blog.errPost              = null;
};

const onFetchBlogPostFailure = (draft, payload) => {
  draft.blog.wipPost = false;
  draft.blog.errPost = payload;
};

const onSetLanguage = draft => {
  draft.publishers.byID = {};
  draft.collections     = {};

  let { pageNo, total } = draft.twitter;
  draft.twitter         = { ...initialState.twitter, pageNo, total };

  ({ pageNo, total } = draft.blog)
  draft.blog         = { ...initialState.blog, pageNo, total };
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
  [FETCH_COLLECTIONS]: onFetchCollections,

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
const getCollections   = state => state.collections;

const getTwitter      = (state, id) => state.twitter.byID[id];
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
  getCollections,

  getTwitter,
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

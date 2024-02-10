import { createSlice } from '@reduxjs/toolkit';

import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import { actions as settingsActions } from './settings';
import { actions as ssrActions } from './ssr';

const initialState = {
  publishers : {
    byID: {}
  },
  collections: {},
  twitter    : {
    byID  : {},
    tweets: [],
    pageNo: 1,
    total : 0,
    wip   : false,
    err   : null
  },
  blog       : {
    byID   : {},
    posts  : [],
    total  : 0,
    pageNo : 1,
    wip    : false,
    err    : null,
    wipPost: false,
    errPost: null
  }
};

const onFetchTweetsSuccess = (state, { payload: { tweets = [], total } }) => {
  const { twitter } = state;

  twitter.tweets.length = 0;
  tweets.forEach(x => {
    twitter.byID[x.twitter_id] = x;
    twitter.tweets.push(x);
  });
  twitter.wip   = false;
  twitter.total = total;
};

const onFetchBlogListSuccess = (state, { payload: { total, posts } }) => {
  const { blog }  = state;
  const { byID }  = blog;
  const blogPosts = blog.posts;

  blogPosts.length = 0;
  posts.forEach(x => {
    const k = `${x.blog}${x.wp_id}`;
    byID[k] = x;
    blogPosts.push(k);
  });
  blog.total = total;
  blog.wip   = false;
  blog.err   = null;
};

const onFetchBlogPostSuccess = (state, { payload }) => {
  const { blog, wp_id: id } = payload;

  state.blog.byID[`${blog}${id}`] = payload;
  state.blog.wipPost              = false;
  state.blog.errPost              = null;
};

const onSetLanguage = state => {
  state.publishers.byID = {};
  state.collections     = {};

  let { pageNo, total } = state.twitter;
  state.twitter         = { ...initialState.twitter, pageNo, total };

  ({ pageNo, total } = state.blog);
  state.blog = { ...initialState.blog, pageNo, total };
};

const onSSRPrepare = state => {
  if (state.twitter.err) {
    state.twitter.err = state.twitter.err.toString();
  }

  if (state.blog.err) {
    state.blog.err = state.blog.err.toString();
  }

  if (state.blog.errPost) {
    state.blog.errPost = state.blog.errPost.toString();
  }
};

const publicationsSlice = createSlice({
  name: 'publications',
  initialState,

  reducers     : {
    setTab           : () => void ({}),
    setPage          : {
      prepare: (namespace, pageNo) => ({ payload: { namespace, pageNo } }),
      reducer: (state, { payload: { namespace, pageNo } }) => {
        const ns         = namespace.split('-')[1];
        state[ns].pageNo = pageNo;
      }
    },
    receivePublishers: (state, { payload }) => void (state.publishers.byID = payload.reduce((acc, val) => {
      acc[val.id] = val;
      return acc;
    }, {})),
    fetchCollections : (state, { payload }) => void (state.collections = mapValues(groupBy(payload, x => x.content_type), x => x.map(y => y.id))),

    fetchTweets       : {
      prepare: (namespace, pageNo, params = {}) => ({ payload: { namespace, pageNo, ...params } }),
      reducer: state => void (state.twitter.wip = true)
    },
    fetchTweetsSuccess: onFetchTweetsSuccess,
    fetchTweetsFailure: (state, payload) => {
      state.twitter.wip = false;
      state.twitter.err = payload;
    },

    fetchBlogList       : {
      prepare: (namespace, pageNo, params = {}) => ({ payload: { namespace, pageNo, ...params } }),
      reducer: state => void (state.blog.wip = true)
    },
    fetchBlogListSuccess: onFetchBlogListSuccess,
    fetchBlogListFailure: (state, payload) => {
      state.blog.wip = false;
      state.blog.err = payload;
    },

    fetchBlogPost       : {
      prepare: (blog, id) => ({ payload: { blog, id } }),
      reducer: state => void (state.blog.wipPost = true)
    },
    fetchBlogPostSuccess: onFetchBlogPostSuccess,
    fetchBlogPostFailure: (state, payload) => {
      state.blog.wipPost = false;
      state.blog.errPost = payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(ssrActions.prepare, onSSRPrepare)
      .addCase(settingsActions.setContentLanguages, onSetLanguage);
  },

  selectors: {
    getPublisherById: state => state.publishers.byID,
    getCollections  : state => state.collections,

    getTwitter     : (state, id) => state.twitter.byID[id],
    getTweets      : state => state.twitter.tweets,
    getTweetsTotal : state => state.twitter.total,
    getTweetsPageNo: state => state.twitter.pageNo,
    getTweetsWip   : state => state.twitter.wip,
    getTweetsError : state => state.twitter.err,

    getBlogPost     : (state, blog, id) => state.blog.byID[`${blog}${id}`],
    getBlogPosts    : state => state.blog.posts.map(x => state.blog.byID[x]),
    getBlogTotal    : state => state.blog.total,
    getBlogPageNo   : state => state.blog.pageNo,
    getBlogWip      : state => state.blog.wip,
    getBlogError    : state => state.blog.err,
    getBlogWipPost  : state => state.blog.wipPost,
    getBlogErrorPost: state => state.blog.errPost
  }
});

export default publicationsSlice.reducer;

export const { actions } = publicationsSlice;

export const types = Object.fromEntries(new Map(
  Object.values(publicationsSlice.actions).map(a => [a.type, a.type])
));

export const selectors = publicationsSlice.getSelectors();

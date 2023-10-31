import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import { createSlice } from '@reduxjs/toolkit';
import { fetchTweets, fetchBlogPost, fetchBlogList } from './thunks';
import { HYDRATE } from 'next-redux-wrapper';

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

const onReceivePublishers = (draft, { payload }) => {
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
  tweets.forEach(x => {
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
  const { blog }  = draft;
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
/*

const onSetLanguage = (draft, payload) => {
  draft.publishers.byID = {};
  draft.collections     = {};

  let { pageNo, total } = draft.twitter;
  draft.twitter         = { ...initialState.twitter, pageNo, total };

  ({ pageNo, total } = draft.blog);
  draft.blog = { ...initialState.blog, pageNo, total };
};
*/

export const publicationsSlice = createSlice({
  name: 'publications',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setPage: onSetPage,
    fetchTweets: onFetchTweets,
    fetchBlogList: onFetchBlogList,
    fetchBlogPost: onFetchBlogPost,
    receivePublishers: onReceivePublishers,
    receiveBlogPosts: onFetchBlogPostSuccess,
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload.publications, };
    });
    builder.addCase(fetchTweets.fulfilled, onFetchTweetsSuccess);
    builder.addCase(fetchTweets.rejected, onFetchTweetsFailure);

    builder.addCase(fetchBlogList.fulfilled, onFetchBlogListSuccess);
    builder.addCase(fetchBlogList.rejected, onFetchBlogListFailure);

    builder.addCase(fetchBlogPost.fulfilled, onFetchBlogPostSuccess);
    builder.addCase(fetchBlogPost.rejected, onFetchBlogPostFailure);
  }
});

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
const getBlogPosts     = state => {
  return state.blog.posts.map(x => state.blog.byID[x]);
}
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

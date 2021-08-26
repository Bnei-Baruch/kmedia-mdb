import { createAction } from 'redux-actions';

import { handleActions } from './settings';
import {
  MY_NAMESPACE_LIKES,
  MY_NAMESPACE_PLAYLIST_BY_ID, MY_NAMESPACE_PLAYLIST_ITEMS,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACES
} from '../../helpers/consts';

/* Types */
const SET_PAGE = 'My/SET_PAGE';

const FETCH         = 'My/FETCH';
const FETCH_BY_ID   = 'My/FETCH_BY_ID';
const FETCH_SUCCESS = 'My/FETCH_SUCCESS';
const FETCH_FAILURE = 'My/FETCH_FAILURE';

const ADD         = 'My/ADD';
const ADD_SUCCESS = 'My/ADD_SUCCESS';

const EDIT         = 'My/EDIT';
const EDIT_SUCCESS = 'My/EDIT_SUCCESS';

const REMOVE         = 'My/REMOVE';
const REMOVE_SUCCESS = 'My/REMOVE_SUCCESS';

const LIKE_COUNT         = 'My/LIKE_COUNT';
const LIKE_COUNT_SUCCESS = 'My/LIKE_COUNT_SUCCESS';

export const types = {
  SET_PAGE,

  FETCH,
  FETCH_BY_ID,
  FETCH_SUCCESS,
  FETCH_FAILURE,

  ADD,
  ADD_SUCCESS,

  EDIT,
  EDIT_SUCCESS,

  REMOVE,
  REMOVE_SUCCESS,

  LIKE_COUNT,
  LIKE_COUNT_SUCCESS,
};

/* Actions */

const setPage = createAction(SET_PAGE, (namespace, pageNo) => ({ namespace, pageNo }));

const fetch        = createAction(FETCH, (namespace, params) => ({ namespace, ...params }));
const fetchById    = createAction(FETCH_BY_ID, (namespace, params) => ({ namespace, ...params }));
const fetchSuccess = createAction(FETCH_SUCCESS);
const fetchFailure = createAction(FETCH_FAILURE);

const add        = createAction(ADD, (namespace, params) => ({ namespace, ...params }));
const addSuccess = createAction(ADD_SUCCESS);

const edit        = createAction(EDIT, (namespace, params) => ({ namespace, ...params }));
const editSuccess = createAction(EDIT_SUCCESS);

const remove        = createAction(REMOVE, (namespace, params) => ({ namespace, ...params }));
const removeSuccess = createAction(REMOVE_SUCCESS);

const likeCount        = createAction(LIKE_COUNT);
const likeCountSuccess = createAction(LIKE_COUNT_SUCCESS);

export const actions = {
  setPage,

  fetch,
  fetchById,
  fetchSuccess,
  fetchFailure,

  add,
  addSuccess,

  edit,
  editSuccess,

  remove,
  removeSuccess,

  likeCount,
  likeCountSuccess,

};

/* Reducer */
const initialState = MY_NAMESPACES.reduce((acc, n) => {
  acc[n] = {
    items: [],
    wip: false,
    total: 0,
    errors: null
  };
  return acc;
}, { likeCount: 0, [MY_NAMESPACE_PLAYLIST_BY_ID]: { byID: {} } });

const onSetPage = (draft, { namespace, pageNo }) => {
  draft[namespace].pageNo = pageNo;
};

const onFetch = (draft, { namespace }) => {
  draft[namespace].total  = 0;
  draft[namespace].wip    = true;
  draft[namespace].errors = false;
  return draft;
};

const onFetchSuccess = (draft, { namespace, items = [], total }) => {
  if (namespace === MY_NAMESPACE_PLAYLIST_BY_ID) {
    items.forEach(x => {
      draft[MY_NAMESPACE_PLAYLIST_BY_ID].byID[x.id] = x;
      draft[MY_NAMESPACE_PLAYLIST_ITEMS].items      = x.playlist_items || [];
    });

  } else {
    draft[namespace].items = items || [];
    draft[namespace].total = total;
  }
  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  return draft;
};

const onFetchFailure = (draft, { namespace }) => {
  draft[namespace].wip    = false;
  draft[namespace].errors = true;
  return draft;
};

const onAddSuccess = (draft, { namespace, items }) => {
  draft[namespace].items  = draft[namespace].items.concat(items);
  draft[namespace].total  = draft[namespace].total + items.length;
  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  if (namespace === MY_NAMESPACE_LIKES) ++draft.likeCount;
  return draft;
};

const onEditSuccess = (draft, { namespace, item }) => {
  let index = draft[namespace].items.findIndex(x => x.id === item.id);
  if (index < 0) index = draft[namespace].items.length;

  if (namespace === MY_NAMESPACE_PLAYLISTS)
    draft[MY_NAMESPACE_PLAYLIST_BY_ID].byID[item.id] = { ...item, playlist_items: draft[MY_NAMESPACE_PLAYLIST_BY_ID].byID[item.id].playlist_items };

  if (namespace === MY_NAMESPACE_PLAYLIST_ITEMS) {
    const playlist = draft[MY_NAMESPACE_PLAYLIST_BY_ID].byID[item.playlist_id];
    let itemIndex  = playlist.playlist_items.findIndex(x => x.id === item.id);
    if (itemIndex < 0) index = playlist.playlist_items.length;
    playlist.playlist_items[itemIndex] = item;
  }

  draft[namespace].items[index] = item;
  draft[namespace].wip          = false;
  draft[namespace].errors       = false;
  return draft;
};

const onRemoveSuccess = (draft, { namespace, ids, playlist_id }) => {
  if (namespace === MY_NAMESPACE_PLAYLIST_ITEMS) {
    draft[namespace].items.filter(x => ids.includes(x.id)).forEach(x => {
      const playlist          = draft[MY_NAMESPACE_PLAYLIST_BY_ID].byID[x.playlist_id];
      playlist.playlist_items = playlist.playlist_items.filter(a => !ids.includes(a.id));
    });
  }
  draft[namespace].items  = draft[namespace].items.filter(a => !ids.includes(a.id));
  draft[namespace].total  = draft[namespace].total - ids.length;
  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  if (namespace === MY_NAMESPACE_LIKES) --draft.likeCount;
  return draft;
};

const onLikeCountSuccess = (draft, count) => {
  draft.likeCount = count;
  return draft;
};

export const reducer = handleActions({
  [SET_PAGE]: onSetPage,

  [FETCH]: onFetch,
  [FETCH_BY_ID]: onFetch,
  [FETCH_SUCCESS]: onFetchSuccess,
  [FETCH_FAILURE]: onFetchFailure,

  [ADD_SUCCESS]: onAddSuccess,
  [EDIT_SUCCESS]: onEditSuccess,
  [REMOVE_SUCCESS]: onRemoveSuccess,

  [LIKE_COUNT_SUCCESS]: onLikeCountSuccess,
}, initialState);

/* Selectors */
const getItems        = (state, namespace) => state[namespace].items;
const getPlaylistById = (state, id) => state[MY_NAMESPACE_PLAYLIST_BY_ID].byID[id];
const getWIP          = (state, namespace) => state[namespace].wip;
const getErr          = (state, namespace) => state[namespace].errors;
const getPageNo       = (state, namespace) => state[namespace].pageNo;
const getTotal        = (state, namespace) => state[namespace].total;
const getLikeCount    = state => state.likeCount;

export const selectors = {
  getItems,
  getPlaylistById,
  getWIP,
  getErr,
  getPageNo,
  setPage,
  getTotal,
  getLikeCount,
};

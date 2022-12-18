import { createAction } from 'redux-actions';

import { isEmpty, isNotEmptyArray, strCmp, getEscapedRegExp } from '../../helpers/utils';
import { SRC_VOLUME } from '../../helpers/consts';
import { selectors as mdb } from './mdb';
import { handleActions, types as settings } from './settings';
import { selectors as sources } from './sources';
import { selectors as tags } from './tags';
import { types as ssr } from './ssr';

/* Types */
const SET_TAB = 'Lessons/SET_TAB';

const FETCH_ALL_SERIES         = 'Lessons/FETCH_ALL_SERIES';
const FETCH_ALL_SERIES_SUCCESS = 'Lessons/FETCH_ALL_SERIES_SUCCESS';
const FETCH_ALL_SERIES_FAILURE = 'Lessons/FETCH_ALL_SERIES_FAILURE';

export const types = {
  SET_TAB,

  FETCH_ALL_SERIES,
  FETCH_ALL_SERIES_SUCCESS,
  FETCH_ALL_SERIES_FAILURE,
};

/* Actions */
const setTab = createAction(SET_TAB);

const fetchAllSeries        = createAction(FETCH_ALL_SERIES);
const fetchAllSeriesSuccess = createAction(FETCH_ALL_SERIES_SUCCESS);
const fetchAllSeriesFailure = createAction(FETCH_ALL_SERIES_FAILURE);

export const actions = {
  setTab,

  fetchAllSeries,
  fetchAllSeriesSuccess,
  fetchAllSeriesFailure,
};

/* Reducer */

const initialState = {
  seriesIDs: [],
  seriesLoaded: false,
  wip: {
    series: false,
  },
  errors: {
    series: null,
  },
};

/**
 * Set the wip and errors part of the state
 */
const setStatus = (draft, payload, type) => {
  switch (type) {
    case FETCH_ALL_SERIES:
      draft.wip.series = true;
      break;
    case FETCH_ALL_SERIES_SUCCESS:
      draft.wip.series    = false;
      draft.errors.series = null;
      draft.seriesLoaded = true;
      break;
    case FETCH_ALL_SERIES_FAILURE:
      draft.wip.series    = false;
      draft.errors.series = payload;
      break;
    default:
      break;
  }
};

const onFetchAllSeriesSuccess = (draft, payload, type) => {
  draft.seriesIDs = payload.collections.map(x => x.id);
  setStatus(draft, payload, type);
};

const onSetLanguage = draft => {
  draft.seriesIDs = [];
  draft.seriesLoaded = false;
};

const onSSRPrepare = draft => {
  if (draft.errors.series) {
    draft.errors.series = draft.errors.series.toString();
  }
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_ALL_SERIES]: setStatus,
  [FETCH_ALL_SERIES_SUCCESS]: onFetchAllSeriesSuccess,
  [FETCH_ALL_SERIES_FAILURE]: setStatus,
}, initialState);

/* Selectors */

const getWip          = state => state.wip;
const getErrors       = state => state.errors;
const getSeriesIDs    = state => state.seriesIDs;
const getSeriesLoaded = state => state.seriesLoaded;

const $$sortTree = node => {
  if (isEmpty(node)) {
    return [];
  }

  // non-leaf nodes are reshaped to {name, children}
  // instead of {name, item, item, item...}
  const nonLeafChildren = Object.keys(node)
    .filter(x => x !== 'name' && x !== 'id' && x !== 'parent_id' && x !== 'type')
    .map(x => node[x])
    .sort(x => x.name);

  const { id, parent_id, name, type, children = [] } = node;

  // leaf nodes has array of children
  // we sort them by start_date
  if (isNotEmptyArray(children)) {
    children.sort((a, b) => strCmp(a.start_date, b.start_date));
  }

  const { id: nId, start_date } = isNotEmptyArray(nonLeafChildren) ? nonLeafChildren[0] : false;

  // sort the non leaf nodes (with an id but don't have a start_date ) and add them to children
  if (nId && !start_date) {
    children.push(...nonLeafChildren.map($$sortTree));
  }

  return {
    id,
    name,
    parent_id,
    type,
    children,
  };
};

const getTree = (state, match) => {
  const srcPathById = sources.getPathByID(state.sources);
  const tagPathById = tags.getPathByID(state.tags);

  // sources might not have been loaded by now
  if (!srcPathById || !tagPathById) {
    return [];
  }

  const regExp = match && getEscapedRegExp(match);

  const allSeries = state.lessons.seriesIDs
    .map(serId => mdb.getCollectionById(state.mdb, serId))
    .filter(series => !!series);

  const byTag = allSeries.reduce((acc, series) => {
    const { tag_id, name } = series;

    if (isNotEmptyArray(tag_id)) {
      const tagPaths = tag_id.map(tagId => tagPathById(tagId));

      for (let i = 0; i < tagPaths.length; i++) {
        // check filter
        const exists = match
          ? tagPaths[i].map(x => x.label).find(n => regExp.test(n)) || regExp.test(name)
          : true;

        if (exists) {
          addToTagsTree(acc, tagPaths[i], series);
        }
      }
    }

    return acc;
  }, {});

  // construct the folder-like tree
  const bySourceTree = allSeries.reduce((acc, series) => {
    const { source_id, name } = series;
    if (!source_id) {
      return acc;
    }

    const path = srcPathById(source_id);
    if (!Array.isArray(path) || path.length === 0) {
      return acc;
    }

    // check filter
    const exists = match
      ? path.map(x => x.name).find(n => regExp.test(n)) || regExp.test(name)
      : true;

    if (exists) {
      addToSourcesTree(acc, path, series);
    }

    return acc;
  }, {});

  return { bySourceTree, byTag };
};

const addToTagsTree = (acc, path, series) => {
  let dir = acc;
  for (let i = 0; i < path.length; i++) {
    const { id, label, parent_id, type } = path[i];

    dir[id] = dir[id] || {};
    dir     = dir[id];

    dir.id        = id;
    dir.parent_id = parent_id;
    dir.name      = label;
    dir.type      = type;
  }

  dir.children = dir.children || [];
  dir.children.push(series);
};

const addToSourcesTree = (acc, path, series) => {
  const hasVolume = path.some(p => p.type === SRC_VOLUME);

  let volumeId, volumeParentId;
  let dir = acc;
  for (let i = 0; i < path.length; i++) {
    const { id, name, type } = path[i];
    let { parent_id }        = path[i];

    if (hasVolume) {
      // save volume data for later and skip the path part
      if (type === SRC_VOLUME) {
        volumeId       = id;
        volumeParentId = parent_id;
        continue;
      }

      // for volume child - set the parent to be grandparent, e.g. skip the volume in the tree
      if (parent_id === volumeId) {
        parent_id = volumeParentId;
      }
    }

    dir[id] = dir[id] || {};
    dir     = dir[id];

    dir.id        = id;
    dir.parent_id = parent_id;
    dir.name      = name;
    dir.type      = type;
  }

  // mv series path.children
  dir.children = dir.children || [];
  dir.children.push(series);
};

const getSeriesTree = (state, match) => {
  const { bySourceTree, byTag } = getTree(state, match);

  if (isEmpty(bySourceTree) && isEmpty(byTag)) {
    return null;
  }

  const roots         = sources.getRoots(state.sources);
  const getSourceById = sources.getSourceById(state.sources);
  const authors       = roots.map(getSourceById);

  const getAuthorsDisplayName = authorId => {
    const author              = authors.find(a => a.id === authorId);
    const { name, full_name } = author;

    // don't display the long names like Rabbi Yehuda Leib Ashlag
    // but display full name of Rav - Michael Laitman, Ph.D
    const displayName = full_name.includes(name)
      ? full_name
      : name;
    return displayName;
  };

  const fullTree = {};

  Object.keys(bySourceTree).filter(key => key !== 'vk').forEach(key => {
    bySourceTree[key].name = getAuthorsDisplayName(key);
    fullTree[key]          = bySourceTree[key];
  });

  fullTree['byTopics'] = { 'id': 'byTopics', 'name': 'By Topics' };

  Object.keys(byTag).forEach(key => {
    fullTree['byTopics'][key] = byTag[key];
  });

  const sortedTree = $$sortTree(fullTree);
  return sortedTree.children;
};

const getSerieBySourceId = (state, mdbState, sourcesState) => sId => {
  const source      = sources.getSourceById(sourcesState)(sId);
  const collections = state.seriesIDs.map(id => mdb.getCollectionById(mdbState, id)).filter(({ source_id }) => source_id === sId);
  return { ...source, collections };
};

const getSerieByTagId = (state, mdbState, tagsState) => tId => {
  const tag         = tags.getTagById(tagsState)(tId);
  const collections = state.seriesIDs.map(id => mdb.getCollectionById(mdbState, id)).filter(({ tag_id }) => tag_id?.includes(tId));
  return { ...tag, collections };
};

export const selectors = {
  getWip,
  getErrors,
  getSeriesIDs,
  getSeriesLoaded,
  getSeriesTree,
  getSerieBySourceId,
  getSerieByTagId,
};

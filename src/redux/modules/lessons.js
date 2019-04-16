import { createAction } from 'redux-actions';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';

import { isEmpty, strCmp } from '../../helpers/utils';
import { selectors as mdb } from './mdb';
import { handleActions, types as settings } from './settings';
import { selectors as sources } from './sources';
import { types as ssr } from './ssr';

/* Types */

const SET_TAB = 'Lessons/SET_TAB';

const RECEIVE_LECTURES         = 'Lessons/RECEIVE_LECTURES';
const FETCH_ALL_SERIES         = 'Lessons/FETCH_ALL_SERIES';
const FETCH_ALL_SERIES_SUCCESS = 'Lessons/FETCH_ALL_SERIES_SUCCESS';
const FETCH_ALL_SERIES_FAILURE = 'Lessons/FETCH_ALL_SERIES_FAILURE';

export const types = {
  SET_TAB,

  RECEIVE_LECTURES,
  FETCH_ALL_SERIES,
  FETCH_ALL_SERIES_SUCCESS,
  FETCH_ALL_SERIES_FAILURE,
};

/* Actions */

const setTab = createAction(SET_TAB);

const receiveLectures       = createAction(RECEIVE_LECTURES);
const fetchAllSeries        = createAction(FETCH_ALL_SERIES);
const fetchAllSeriesSuccess = createAction(FETCH_ALL_SERIES_SUCCESS);
const fetchAllSeriesFailure = createAction(FETCH_ALL_SERIES_FAILURE);

export const actions = {
  setTab,

  receiveLectures,
  fetchAllSeries,
  fetchAllSeriesSuccess,
  fetchAllSeriesFailure,
};

/* Reducer */

const initialState = {
  seriesIDs: [],
  lecturesByType: {},
  wip: {
    lectures: false,
    series: false,
  },
  errors: {
    lectures: null,
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
    break;
  case FETCH_ALL_SERIES_FAILURE:
    draft.wip.series    = false;
    draft.errors.series = payload;
    break;
  default:
    break;
  }
};

const onReceiveLectures = (draft, payload) => {
  draft.lecturesByType = mapValues(groupBy(payload, x => x.content_type), x => x.map(y => y.id));
};

const onFetchAllSeriesSuccess = (draft, payload) => {
  draft.seriesIDs = payload.collections.map(x => x.id);
};

const onSetLanguage = draft => {
  draft.lecturesByType = {};
  draft.seriesIDs      = [];
};

const onSSRPrepare = draft => {
  if (draft.errors.lectures) {
    draft.errors.lectures = draft.errors.lectures.toString();
  }
  if (draft.errors.series) {
    draft.errors.series = draft.errors.series.toString();
  }
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [RECEIVE_LECTURES]: onReceiveLectures,
  [FETCH_ALL_SERIES]: setStatus,
  [FETCH_ALL_SERIES_SUCCESS]: (draft, payload, type) => {
    onFetchAllSeriesSuccess(draft, payload);
    setStatus(draft, payload, type);
  },
  [FETCH_ALL_SERIES_FAILURE]: setStatus,
}, initialState);

/* Selectors */

const getWip            = state => state.wip;
const getErrors         = state => state.errors;
const getLecturesByType = state => state.lecturesByType;

const $$sortTree = (node) => {
  if (isEmpty(node)) {
    return [];
  }

  // leaf nodes has array of items
  // we sort them by start_date
  if (Array.isArray(node.items)) {
    node.items.sort((a, b) => strCmp(a.start_date, b.start_date));
    return node;
  }

  // non-leaf nodes are reshaped to {name, items}
  // instead of {name, item, item, item...}
  const l = Object.keys(node)
    .filter(x => x !== 'name')
    .map(x => node[x]);
  l.sort(x => x.name);

  return {
    name: node.name,
    items: l.map($$sortTree),
  };
};

const getSeriesBySource = (state, mdbState, sourcesState) => {
  const srcPathById = sources.getPathByID(sourcesState);

  // sources might not have been loaded by now
  if (!srcPathById) {
    return [];
  }

  // construct the folder-like tree
  const tree = state.seriesIDs.reduce((acc, val) => {
    const series = mdb.getCollectionById(mdbState, val);

    // mdb might not have been loaded by now
    if (!series) {
      return acc;
    }

    const { source_id: sourceID } = series;
    if (!sourceID) {
      return acc;
    }

    const path = srcPathById(sourceID);
    if (!Array.isArray(path) || path.length === 0) {
      return acc;
    }

    // mkdir -p path[:]
    let dir = acc;
    for (let i = 0; i < path.length; i++) {
      dir[path[i].id] = dir[path[i].id] || {};
      dir             = dir[path[i].id];

      dir.name = path[i].name;
    }

    // mv series path.items
    dir.items = dir.items || [];
    dir.items.push(series);

    return acc;
  }, {});

  return $$sortTree(tree).items;
};

export const selectors = {
  getWip,
  getErrors,
  getLecturesByType,
  getSeriesBySource,
};

import { createAction, handleActions } from 'redux-actions';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';

import { isEmpty, strCmp } from '../../helpers/utils';
import { selectors as mdb } from './mdb';
import { types as settings } from './settings';
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
 * @param state
 * @param action
 * @returns {{wip: {}, errors: {}}}
 */
const setStatus = (state, action) => {
  const wip    = { ...state.wip };
  const errors = { ...state.errors };

  switch (action.type) {
  case FETCH_ALL_SERIES:
    wip.series = true;
    break;
  case FETCH_ALL_SERIES_SUCCESS:
    wip.series    = false;
    errors.series = null;
    break;
  case FETCH_ALL_SERIES_FAILURE:
    wip.series    = false;
    errors.series = action.payload;
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

const onReceiveLectures = (state, action) => ({
  ...state,
  lecturesByType: mapValues(groupBy(action.payload, x => x.content_type), x => x.map(y => y.id)),
});

const onFetchAllSeriesSuccess = (state, action) => ({
  ...state,
  seriesIDs: action.payload.collections.map(x => x.id),
});

const onSetLanguage = state => (
  {
    ...state,
    lecturesByType: {},
    seriesIDs: [],
  }
);

const onSSRPrepare = state => ({
  ...state,
  errors: {
    lectures: state.errors.lectures ? state.errors.lectures.toString() : state.errors.lectures,
    series: state.errors.series ? state.errors.series.toString() : state.errors.series,
  }
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [RECEIVE_LECTURES]: onReceiveLectures,
  [FETCH_ALL_SERIES]: setStatus,
  [FETCH_ALL_SERIES_SUCCESS]: (state, action) => setStatus(onFetchAllSeriesSuccess(state, action), action),
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

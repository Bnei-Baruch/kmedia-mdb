import { createAction, handleActions } from 'redux-actions';
import identity from 'lodash/identity';

import { BS_ETZ_HAIM, BS_IGROT, BS_SHAMATI, BS_TAAS, MR_TORA, RB_IGROT, RH_ZOHAR } from '../../helpers/consts';
import { strCmp, tracePath } from '../../helpers/utils';
import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const RECEIVE_SOURCES = 'Sources/RECEIVE_SOURCES';
const SOURCES_SORT_BY = 'Sources/SOURCES_SORT_BY';

export const types = {
  RECEIVE_SOURCES,
  SOURCES_SORT_BY,
};

/* Actions */

const receiveSources = createAction(RECEIVE_SOURCES);
const sourcesSortBy  = createAction(SOURCES_SORT_BY);

export const actions = {
  receiveSources,
  sourcesSortBy,
};

/* Reducer */

const initialState = {
  byId: {},
  roots: [],
  sortedByAZ: {
    getByID: identity
  },
  sortedByBook: {
    getByID: identity
  },
  loaded: false,
  sortBy: 'Book',
};

const NotToSort   = [BS_SHAMATI, BS_IGROT, BS_TAAS, RB_IGROT, MR_TORA, RH_ZOHAR, BS_ETZ_HAIM, 'grRABASH'];
const NotToFilter = [BS_TAAS];

const sortTree = root => {
  if (root.children) {
    root.children
      .sort((a, b) => strCmp(a.name, b.name))
      .forEach(sortTree);
  }
};

const sortSources = items => {
  items.forEach(i => {
    // We not going to sort the upper level [i.e. 'kabbalists'],
    // especially if it doesn't have children
    if (!i.children) {
      return;
    }

    i.children.forEach(c => {
      // The second level's id is the one that is used to distinguish
      // between sortable and not sortable sources
      const shouldSort = NotToSort.findIndex(a => a === c.id);
      if (shouldSort === -1) {
        sortTree(c);
      }
    });
  });
};

const buildById = items => {
  const byId = {};

  // We BFS the tree, extracting each item by it's ID
  // and normalizing it's children
  let s = [...items];
  while (s.length > 0) {
    const node = s.pop();
    if (node.children) {
      s = s.concat(node.children);
    }

    byId[node.id] = {
      ...node,
      children: node.children ? node.children.map(x => x.id) : [],
    };
  }

  return byId;
};

const prepareById = payload => {
  const book = JSON.parse(JSON.stringify(payload)); // Deep copy
  const byId = buildById(book);
  const az   = JSON.parse(JSON.stringify(payload)); // Deep copy
  // Yes, this is not good, but...
  // We sort sources according to Mizrachi's request
  // and this __changes__ data
  sortSources(az);
  const byIdAZ = buildById(az);

  return [byId, byIdAZ];
};

const getIdFuncs = byId => {
  const getByID     = id => byId[id];
  const getPath     = source => tracePath(source, getByID);
  const getPathByID = id => getPath(getByID(id));
  return { getByID, getPath, getPathByID };
};

const onSSRPrepare = () => ({ ...initialState });

const groupRabash      = [
  'IHYcOU8k', 'he3tEpLu', 'M53FJnYF', 'jXgT6Pa1', 'gzm3fAe8', 'L1OKGSxg',
  'O9a0iCL0', 'QpKRILZk', 'RVlfRn0W', '9nU3N2k2', 'rlfCtHnc', 'uJ34bVH5',
  'tuNiurqI', 'mVQJIMlj', 'VLuOsaN3', '0G3JOBRv', 'UAiHPiou', 'y5BKi0y2',
  'r0GUBxQQ', 'jmrf8Gud', 'HotkF4i5', 'aeUpX57j', 'oR4gtgR7', 'WhVeEvxC',
];

// Plesae note that hose translations werer added to common.json files.
// Consider using common.json instead of this const.
const groupRabashTitle = {
  'en': 'Group Articles',
  'he': 'מאמרי החברה',
  'ru': 'Статьи о группе',
};

const setRabash = (sources, language) => {
  const rb         = sources.find(el => el.id === 'rb');
  const rbArticles = rb.children.find(el => el.id === 'rQ6sIUZK').children;
  const rbLetters  = rb.children.find(el => el.id === 'b8SHlrfH').children;
  const children   = groupRabash.map(gr => {
    const item = rbArticles.find(el => el.id === gr) || rbLetters.find(el => el.id === gr);
    const el   = { ...item, parent_id: 'grRABASH', id: `gr-${item.id}` };
    return el;
  });
  rb.children.push({
    id: 'grRABASH',
    parent_id: 'rb',
    type: 'COLLECTION',
    name: groupRabashTitle[language] || groupRabashTitle['en'],
    children,
  });
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [settings.SET_LANGUAGE]: onSSRPrepare,

  [RECEIVE_SOURCES]: (state, action) => {
    const { sources, language } = action.payload;
    setRabash(sources, language);

    const [byId, byIdAZ] = prepareById(sources);

    // we keep selectors in state to avoid recreating them every time a selector is called
    const sortedByBook = getIdFuncs(byId);
    const sortedByAZ   = getIdFuncs(byIdAZ);

    return {
      ...state,
      byId,
      sortedByBook,
      sortedByAZ,
      loaded: true,
      roots: sources.map(x => x.id),
      sortBy: 'Book'
    };
  },

  [SOURCES_SORT_BY]: (state, action) => ({
    ...state,
    sortBy: action.payload,
  }),

}, initialState);

/* Selectors */

const $$getSourceBy = (state, idx) => {
  const f = state.sortBy === 'AZ' ? state.sortedByAZ : state.sortedByBook;
  return f[idx];
};

const areSourcesLoaded = state => state.loaded;
const getRoots         = state => state.roots;
const getSourceById    = state => $$getSourceBy(state, 'getByID');
const getPath          = state => $$getSourceBy(state, 'getPath');
const getPathByID      = state => $$getSourceBy(state, 'getPathByID');
const sortBy           = state => state.sortBy;

export const selectors = {
  areSourcesLoaded,
  getRoots,
  getSourceById,
  getPath,
  getPathByID,
  sortBy,
  NotToSort,
  NotToFilter,
};

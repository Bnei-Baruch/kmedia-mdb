import { createAction, handleActions } from 'redux-actions';

import {
  BS_ETZ_HAIM,
  BS_IGROT,
  BS_SHAMATI,
  BS_TAAS,
  MR_TORA,
  RB_IGROT,
  RH_ZOHAR
} from '../../../../src/helpers/consts';
import { strCmp, tracePath } from '../../../../src/helpers/utils';
import { types as settings } from '../settingsSlice/settingsSlice';
import { createSlice } from '@reduxjs/toolkit';
import { fetchTags } from '@/lib/redux/slices/tagsSlice';
import { fetchData, fetchBanners } from '@/lib/redux/slices/homeSlice';
import { HYDRATE } from 'next-redux-wrapper';
import { fetchSQData } from '@/lib/redux/slices/mdbSlice/thunks';

/* Reducer */

const initialState = {
  byId: {},
  byIdAZ: {},
  roots: [],
  loaded: false,
  sortBy: 'Book',
};

export const NotToSort   = [BS_SHAMATI, BS_IGROT, BS_TAAS, RB_IGROT, MR_TORA, RH_ZOHAR, BS_ETZ_HAIM, 'grRABASH'];
export const NotToFilter = [BS_TAAS];

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

const groupRabash = [
  'IHYcOU8k', 'he3tEpLu', 'M53FJnYF', 'jXgT6Pa1', 'gzm3fAe8', 'L1OKGSxg',
  'O9a0iCL0', 'QpKRILZk', 'RVlfRn0W', '9nU3N2k2', 'rlfCtHnc', 'uJ34bVH5',
  'tuNiurqI', 'mVQJIMlj', 'VLuOsaN3', '0G3JOBRv', 'UAiHPiou', 'y5BKi0y2',
  'r0GUBxQQ', 'jmrf8Gud', 'HotkF4i5', 'aeUpX57j', 'oR4gtgR7', 'WhVeEvxC',
];

// Plesae note that hose translations were added to common.json files.
// Consider using common.json instead of this const.
const groupRabashTitle = {
  'en': 'Group Articles',
  'he': 'מאמרי החברה',
  'ru': 'Статьи о группе',
};

const setRabash = (sources, uiLang) => {
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
    name: groupRabashTitle[uiLang] || groupRabashTitle['en'],
    children,
  });
};

function onReceiveSources(state, { payload }) {
  const { sources, uiLang } = payload;
  setRabash(sources, uiLang);

  const [byId, byIdAZ] = prepareById(sources);

  state.byId   = byId;
  state.byIdAZ = byIdAZ;
  state.loaded = true;
  state.roots  = sources.map(x => x.id);
  state.sortBy = 'Book';
}

function onSourcesSortBy(state, action) {
  state.sortBy = action.payload;
}

export const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    sourcesSortBy: onSourcesSortBy,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSQData.fulfilled, onReceiveSources);
    builder.addCase(HYDRATE, (state, action) => {
      return ({ ...state, ...action.payload.sources });
    });
  }
});

/* Selectors */

const areSourcesLoaded = state => state.loaded;
const getRoots         = state => state.roots;
const getSourceById    = state => {
  const _byId = state.sortBy === 'AZ' ? state.byIdAZ : state.byId;
  return id => _byId[id];
};

const getPath = state => {
  const _byId = getSourceById(state);
  return source => tracePath(source, _byId);
};

const getPathByID = state => {
  const _byId = getSourceById(state);
  return id => tracePath(_byId(id), _byId);
};

const sortBy = state => state.sortBy;

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

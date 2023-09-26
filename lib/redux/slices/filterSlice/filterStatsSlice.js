import {
  FN_COLLECTION_MULTI,
  FN_CONTENT_TYPE,
  FN_DATE_FILTER,
  FN_LANGUAGES,
  FN_LOCATIONS,
  FN_MEDIA_TYPE,
  FN_ORIGINAL_LANGUAGES,
  FN_PERSON,
  FN_SOURCES_MULTI,
  FN_TOPICS_MULTI
} from '@/src/helpers/consts';
import { createSlice } from '@reduxjs/toolkit';
import { fetchStat, fetchElasticStat } from '@/lib/redux/slices/filterSlice/thunks';
import { HYDRATE } from 'next-redux-wrapper';

const fieldNameByFilter = {
  [FN_SOURCES_MULTI]: 'sources',
  [FN_TOPICS_MULTI]: 'tags',
  [FN_CONTENT_TYPE]: 'content_types',
  [FN_DATE_FILTER]: 'dates',
  [FN_LANGUAGES]: 'languages',
  [FN_COLLECTION_MULTI]: 'collections',
  [FN_PERSON]: 'persons',
  [FN_MEDIA_TYPE]: 'media_types',
  [FN_ORIGINAL_LANGUAGES]: 'original_languages',
};

const FILTER_NAMES = [
  FN_TOPICS_MULTI,
  FN_SOURCES_MULTI,
  FN_CONTENT_TYPE,
  FN_COLLECTION_MULTI,
  FN_DATE_FILTER,
  FN_PERSON,
  FN_MEDIA_TYPE,
  FN_ORIGINAL_LANGUAGES,
  FN_LANGUAGES
];

/* Reducer */

const onFetchStatsSuccess = (draft, { payload }) => {
  const { dataCU, dataC, dataL, namespace, isPrepare } = payload;

  const ns = draft[namespace] || {};

  FILTER_NAMES.forEach(fn => {
    const acc = ns[fn] || { tree: [], byId: {} };
    const dcu = dataCU[fieldNameByFilter[fn]] || {};
    const dc  = dataC[fieldNameByFilter[fn]] || {};
    const dl  = dataL[fieldNameByFilter[fn]] || {};
    if (isPrepare) {
      [...Object.keys({ ...dcu, ...dc, ...dl })]
        .filter(id => !!id)
        .forEach(id => {
          if (!(id in acc.byId)) {
            acc.tree.push(id);
          }

          acc.byId[id] = (dcu[id] || 0) + (dc[id] || 0) + (dl[id] || 0);
          if (!acc.tree.includes(id)) {
            acc.tree.push(id);
          }
        });
    } else {
      acc.tree.forEach(id => {
        acc.byId[id] = (dcu[id] || 0) + (dc[id] || 0) + (dl[id] || 0);
      });
    }
    ns[fn] = acc;
  });

  draft[namespace] = { ...ns, wip: false, err: null, isReady: true, needRefresh: isPrepare };
  return draft;
};

const onFetchElasticStatsSuccess = (draft, { data, namespace }) => {
  const ns = draft[namespace] || FILTER_NAMES.reduce((acc, fn) => {
    acc[fn] = {};
    return acc;
  }, {});

  FILTER_NAMES.forEach(fn => {
    const acc = { tree: [], byId: {} };
    const d   = data[fieldNameByFilter[fn]] || {};
    Object.keys(d)
      .filter(id => !!id)
      .forEach(id => {
        if (!(id in acc.byId)) {
          acc.tree.push(id);
        }

        acc.byId[id] = d[id];
      });

    ns[fn] = acc;
  });

  draft[namespace] = { ...ns, wip: false, err: null, isReady: true };
  return draft;
};

const onReceiveSingleTypeStats = (draft, { dataCU = {}, dataC = {}, dataL = {}, namespace, isPrepare, fn }) => {
  const statsByFN = draft[namespace]?.[fn] || { byId: {}, tree: [] };

  if (isPrepare) {
    [...Object.keys({ ...dataCU, ...dataC, ...dataL })]
      .filter(id => !!id)
      .forEach(id => {
        if (!(id in statsByFN.byId)) {
          statsByFN.tree.push(id);
        }

        statsByFN.byId[id] = (dataCU[id] || 0) + (dataC[id] || 0) + (dataL[id] || 0);
        if (!statsByFN.tree.includes(id)) {
          statsByFN.tree.push(id);
        }
      });
  } else {
    statsByFN.tree.forEach(id => {
      statsByFN.byId[id] = (dataCU[id] || 0) + (dataC[id] || 0) + (dataL[id] || 0);
    });
  }

  draft[namespace] = { ...draft[namespace], [fn]: statsByFN };
  return draft;
};

const onReceiveLocationsStats = (draft, { locations, namespace, isPrepare }) => {
  const stats = draft[namespace]?.[FN_LOCATIONS] || { byId: {}, citiesByCountry: {}, tree: [] };

  if (isPrepare && locations) {
    Object.values(locations)
      .filter(x => !!x.city)
      .forEach(({ city, country, count }) => {
        stats.byId[city] = count;
        if (!stats.citiesByCountry[country]) {
          stats.citiesByCountry[country] = [];
          stats.tree.push(country);
        }

        stats.citiesByCountry[country].push(city);
      });
  } else {
    Object.keys(stats.byId).forEach(id => {
      if (!stats.citiesByCountry[id])
        stats.byId[id] = locations[id]?.count || 0;
    });
  }

  for (const k in stats.citiesByCountry) {
    const c       = stats.citiesByCountry[k].reduce((acc, v) => acc + stats.byId[v], 0);
    stats.byId[k] = c;
  }

  draft[namespace] = { ...draft[namespace], [FN_LOCATIONS]: stats };
};

const onFetchStatsFailure = (draft, ns, err) => {
  if (!draft[ns]) draft[ns] = {};
  draft[ns].wip         = false;
  draft[ns].err         = err;
  draft[ns].needRefresh = false;
};

const onFetchElasticStatsFailure = (draft, ns, err) => {
  draft[ns].wip = false;
  draft[ns].err = err;
};

export const asideSlice = createSlice({
  name: 'filterStats',
  initialState: {},
  reducers: {
    receiveLocationsStats: onReceiveLocationsStats,
    receiveSingleTypeStats: onReceiveSingleTypeStats,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStat.fulfilled, onFetchStatsSuccess);
    builder.addCase(fetchStat.rejected, onFetchStatsFailure);
    builder.addCase(fetchElasticStat.fulfilled, onFetchElasticStatsSuccess);
    builder.addCase(fetchElasticStat.rejected, onFetchElasticStatsFailure);
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload.filterStats };
    });
  }
});

/* Selectors */
const citiesByCountry  = (state, ns) => id => state[ns]?.[FN_LOCATIONS]?.citiesByCountry[id] || [];
const getMultipleStats = (state, ns, fn) => ids => ids.map(id => getStats(state, ns, fn)(id));
const getStats         = (state, ns, fn) => id => state[ns]?.[fn]?.byId[id] || 0;
const getTree          = (state, ns, fn) => state[ns]?.[fn]?.tree || [];
const getStatus        = (state, ns) => ({
  wip: state[ns]?.wip || false,
  err: state[ns]?.err || null,
  isReady: state[ns]?.isReady,
  needRefresh: state[ns]?.needRefresh
});
const isReady          = (state, ns) => {
  return !!state[ns]?.isReady;
};

export const selectors = {
  getStats,
  getMultipleStats,
  getTree,
  isReady,
  getStatus,
  citiesByCountry,
};

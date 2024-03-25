import { createSlice } from '@reduxjs/toolkit';

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
  FN_TOPICS_MULTI,
  FN_PART_OF_DAY
} from '../../helpers/consts';

const fieldNameByFilter = {
  [FN_SOURCES_MULTI]     : 'sources',
  [FN_TOPICS_MULTI]      : 'tags',
  [FN_CONTENT_TYPE]      : 'content_types',
  [FN_DATE_FILTER]       : 'dates',
  [FN_LANGUAGES]         : 'languages',
  [FN_COLLECTION_MULTI]  : 'collections',
  [FN_PERSON]            : 'persons',
  [FN_MEDIA_TYPE]        : 'media_types',
  [FN_ORIGINAL_LANGUAGES]: 'original_languages',
  [FN_PART_OF_DAY]       : 'day_part'
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
  FN_LANGUAGES,
  FN_PART_OF_DAY
];

const onFetchStatsSuccess = (state, { payload: { dataCU, dataC, dataL, namespace, isPrepare } }) => {
  const ns = state[namespace] || FILTER_NAMES.reduce((acc, fn) => {
    acc[fn] = {};
    return acc;
  }, {});

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

  state[namespace] = { ...ns, wip: false, err: null, isReady: true };
};

const onFetchElasticStatsSuccess = (state, { payload: { data, namespace } }) => {
  const ns = state[namespace] || FILTER_NAMES.reduce((acc, fn) => {
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

  state[namespace] = { ...ns, wip: false, err: null, isReady: true };
};

const onReceiveSingleTypeStats = (status, {
  payload: {
    dataCU = {},
    dataC = {},
    dataL = {},
    namespace,
    isPrepare,
    fn
  }
}) => {
  const statsByFN = status[namespace]?.[fn] || { byId: {}, tree: [] };

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

  status[namespace] = { ...status[namespace], [fn]: statsByFN };
};

const onReceiveLocationsStats = (status, { payload: { locations, namespace, isPrepare } }) => {
  const stats = status[namespace]?.[FN_LOCATIONS] || { byId: {}, citiesByCountry: {}, tree: [] };

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

  status[namespace] = { ...status[namespace], [FN_LOCATIONS]: stats };
};

const getStats = (state, ns, fn) => id => state[ns]?.[fn]?.byId[id] || 0;

const filtersAsideSlice = createSlice({
  name        : 'filters_aside',
  initialState: {},

  reducers: {
    fetchElasticStats       : {
      prepare: namespace => ({ payload: { namespace } }),
      reducer: () => void ({})
    },
    fetchElasticStatsSuccess: onFetchElasticStatsSuccess,
    fetchElasticStatsFailure: {
      prepare: (namespace, err) => ({ payload: { namespace, err } }),
      reducer: (state, { payload: { namespace, err } }) => {
        state[namespace].wip = false;
        state[namespace].err = err;
      }
    },

    fetchStats       : {
      prepare: (namespace, params, options = {}) => ({ payload: { namespace, params, options } }),
      reducer: (state, { payload: { namespace } }) => {
        const ns         = state[namespace] || {};
        ns.wip           = true;
        ns.err           = null;
        state[namespace] = ns;
      }
    },
    fetchStatsSuccess: onFetchStatsSuccess,
    fetchStatsFailure: {
      prepare: (namespace, err) => ({ payload: { namespace, err } }),
      reducer: (state, { payload: { namespace, err } }) => {
        state[namespace].wip = false;
        state[namespace].err = err;
      }
    },

    receiveLocationsStats : onReceiveLocationsStats,
    receiveSingleTypeStats: onReceiveSingleTypeStats
  },

  selectors: {
    getTree         : (state, ns, fn) => state[ns]?.[fn]?.tree || [],
    getWipErr       : (state, ns) => ({ wip: state[ns]?.wip || false, err: state[ns]?.err || null }),
    isReady         : (state, ns) => !!state[ns]?.isReady,
    citiesByCountry : (state, ns) => id => state[ns]?.[FN_LOCATIONS]?.citiesByCountry[id] || [],
    getMultipleStats: (state, ns, fn) => ids => {
      const func = getStats(state, ns, fn);
      return ids.map(id => func(id));
    },
    getStats
  }
});

export default filtersAsideSlice.reducer;

export const { actions } = filtersAsideSlice;

export const types = Object.fromEntries(new Map(
  Object.values(filtersAsideSlice.actions).map(a => [a.type, a.type])
));

export const selectors = filtersAsideSlice.getSelectors();

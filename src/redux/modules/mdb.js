import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import minBy from 'lodash/minBy';
import { createSlice } from '@reduxjs/toolkit';

import MediaHelper from '../../helpers/media';
import { actions as settingsActions } from './settings';
import { actions as ssrActions } from './ssr';
import { isEmpty } from '../../helpers/utils';

const freshStore = () => ({
  cById       : {},
  cuById      : {},
  labelById   : {},
  cWindow     : {},
  countCU     : {},
  labelsByCU  : {},
  personById  : {},
  datepickerCO: null,
  wip         : {
    units       : {},
    collections : {},
    cWindow     : {},
    datepickerCO: false,
    lastLesson  : false,
    sqData      : false,
    countCU     : false
  },
  errors      : {
    units       : {},
    collections : {},
    cWindow     : {},
    datepickerCO: null,
    lastLesson  : null,
    sqData      : null,
    countCU     : null
  },
  fetched     : {
    units      : {},
    collections: {}
  }
});

// We remove old wmv and flv files which have been converted to mp4
const stripOldFiles = unit => {
  const { files } = unit;

  // no files in unit
  if (!Array.isArray(files)) {
    return unit;
  }

  // no old files in unit
  if (!files.some(x => MediaHelper.IsWmv(x) || MediaHelper.IsFlv(x))) {
    return unit;
  }

  // group by language and type
  const sMap = groupBy(files, x => `${x.language}_${x.type}`.toLowerCase());

  // filter old files which have been converted
  const nFiles = Object.values(sMap).reduce((acc, val) => {
    // not interesting - only video files have been converted.
    if (val.length < 2 || !MediaHelper.IsVideo(val[0])) {
      return acc.concat(val);
    }

    // find mp4 file if present
    const mp4Files = val.filter(MediaHelper.IsMp4);
    if (mp4Files.length > 0) {
      return acc.concat(mp4Files); // we have some, take only them
    }

    return acc.concat(val);
  }, []).map(f => {
    if (!f.duration) {
      f.duration = unit.duration;
    }

    return f;
  });

  return { ...unit, files: nFiles };
};

const normalizeLinkedUnits = (linkedUnits, type, parentId, state) => {
  const typeKey       = type === 'derived_units' ? 'sduIDs' : 'dduIDs';
  const updatedCuById = { ...state.cuById };
  const ids           = Object.entries(linkedUnits).reduce((acc, val) => {
    const [k, v]          = val;
    const [cuID, relName] = k.split('____');

    // make a copy of linked unit and set parent unit as relation name
    const updatedLU     = { ...v, ...state.cuById[v.id] };
    updatedLU[typeKey]  = { ...updatedLU[typeKey], [parentId]: relName };
    updatedCuById[v.id] = stripOldFiles(updatedLU);

    acc[k] = cuID;
    return acc;
  }, {});

  return { ids, updatedCuById };
};

const onReceiveCollections = (state, items = []) => {
  if (items.length === 0) {
    return;
  }

  const cById = { ...state.cById };
  let cuById  = { ...state.cuById };

  items.forEach(x => {
    // make a copy of incoming data since we're about to mutate it
    const y = { ...x };

    // normalize content units
    if (y.content_units) {

      y.ccuNames = y.ccuNames || {};
      y.cuIDs    = y.content_units.filter(cu => !!cu).map(cu => {
        const ccuName     = cu.name_in_collection;
        y.ccuNames[cu.id] = ccuName;

        // make a copy of content unit and set this collection ccuName
        const updatedCU = { ...cu, ...state.cuById[cu.id] };
        updatedCU.cIDs  = { ...updatedCU.cIDs, [`${y.id}____${ccuName || ''}`]: y.id };

        // normalize derived content units
        if (cu.derived_units) {
          const { ids, updatedCuById } = normalizeLinkedUnits(cu.derived_units, 'derived_units', cu.id, state);
          updatedCU.dduIDs             = ids;
          cuById                       = { ...cuById, ...updatedCuById };
          delete updatedCU.derived_units;
        }

        // normalize source content units
        if (cu.source_units) {
          const { ids, updatedCuById } = normalizeLinkedUnits(cu.source_units, 'source_units', cu.id, state);
          updatedCU.sduIDs             = ids;
          cuById                       = { ...cuById, ...updatedCuById };
          delete updatedCU.source_units;
        }

        // we delete its name_in_collection
        // as it might be overridden by successive calls from different collections
        delete updatedCU.name_in_collection;

        cuById[cu.id] = stripOldFiles(updatedCU);

        return cu.id;
      });
      delete y.content_units;
    }

    // update collection in store
    cById[y.id] = { ...state.cById[y.id], ...y };
  });

  state.cById  = cById;
  state.cuById = cuById;
};

const onReceiveContentUnits = (state, items = []) => {
  if (items.length === 0) {
    return;
  }

  const cById = { ...state.cById };
  let cuById  = { ...state.cuById };
  items.forEach(x => {
    // make a copy of incoming data since we're about to mutate it
    const y = { ...x };

    // normalize collections
    if (y.collections) {
      y.cIDs = Object.entries(y.collections).reduce((acc, val) => {
        const [k, v]         = val;
        const [cID, ccuName] = k.split('____');

        // make a copy of collection and set this unit ccuName
        const updatedC = { ...v, ...cById[v.id] };
        if (updatedC.cuIDs) {
          if (updatedC.cuIDs.findIndex(z => z === y.id) === -1) {
            updatedC.cuIDs = [...updatedC.cuIDs, y.id];
          }
        } else {
          updatedC.cuIDs = [y.id];
        }

        updatedC.ccuNames = { ...updatedC.ccuNames, [y.id]: ccuName };
        cById[v.id]       = updatedC;

        acc[k] = cID;
        return acc;
      }, {});
      delete y.collections;
    }

    // normalize derived content units
    if (y.derived_units) {
      const { ids, updatedCuById } = normalizeLinkedUnits(y.derived_units, 'derived_units', y.id, state);
      y.dduIDs                     = ids;
      cuById                       = { ...cuById, ...updatedCuById };
      delete y.derived_units;
    }

    // normalize source content units
    if (y.source_units) {
      const { ids, updatedCuById } = normalizeLinkedUnits(y.source_units, 'source_units', y.id, state);
      y.sduIDs                     = ids;
      cuById                       = { ...cuById, ...updatedCuById };
      delete y.source_units;
    }

    cuById[y.id] = stripOldFiles({ ...state.cuById[y.id], ...y });
  });

  state.cById  = cById;
  state.cuById = cuById;
};

const onReceiveLabels = (state, action) => {
  const labels = action.payload;
  if (isEmpty(labels)) {
    return;
  }

  const labelsByCU = { ...state.labelsByCU };
  const labelById  = { ...state.labelById };
  for (const i in labels) {
    const { content_unit, id } = labels[i];

    labelById[id] = labels[i];
    if (!labelsByCU[content_unit]?.includes(id)) {
      labelsByCU[content_unit] = [...(labelsByCU[content_unit] || []), id];
    }
  }

  state.labelsByCU = labelsByCU;
  state.labelById  = labelById;
};

const onReceivePersons = (state, action) => {
  if (action.payload === 0) {
    return;
  }

  state.personById = action.payload.reduce((acc, { id, name }) => {
    if (!!id) {
      acc[id] = { id, name };
    }

    return acc;
  }, {});
};

const onFetchWindow = (state, action) => {
  const { id, data } = action.payload;

  state.cWindow = {
    id,
    data: (data.collections || []).map(x => x.id)
  };
};

const onSSRPrepare = state => {
  state.wip                = freshStore().wip;
  state.errors.units       = mapValues(state.errors.units, x => (x ? x.toString() : x));
  state.errors.collections = mapValues(state.errors.collections, x => (x ? x.toString() : x));
  state.errors.lastLesson  = state.errors.lastLesson ? state.errors.lastLesson.toString() : state.errors.lastLesson;
};

const onCountCU = (state, action) => {
  state.countCU[action.payload.namespace] ||= {};
  state.countCU[action.payload.namespace].wip = true;
};

const onCountCUSuccess = (state, action) => {
  state.wip.countCU    = false;
  state.errors.countCU = null;

  state.countCU[action.payload.namespace] = action.payload.total;
};

const getCollectionById = (state, id) => state.cById[id];

const getErrors = state => state.errors;

const getWip = state => state.wip;

const getDenormCollection = (state, id) => {
  let c = state.cById[id];
  if (c && Array.isArray(c.cuIDs)) {
    // make a fresh copy, so we won't mess up normalized storage
    c = { ...c };

    c.content_units = c.cuIDs.map(x => state.cuById[x]).filter(x => !!x);
  }

  return c;
};

const denormalizeObject = (byID, obj) => (
  Object.entries(obj || {}).reduce((acc, val) => {
    const [k, v] = val;
    const c      = byID[v];
    if (c) {
      acc[k] = c;
    }

    return acc;
  }, {})
);

const getDenormContentUnit = (state, id) => {
  let cu = state.cuById[id];

  if (cu) {
    // make a fresh copy, so we won't mess up normalized storage
    cu = { ...cu };

    // denormalize collections
    cu.collections = denormalizeObject(state.cById, cu.cIDs);

    // denormalize derived units
    cu.derived_units = denormalizeObject(state.cuById, cu.dduIDs);

    // denormalize source units
    cu.source_units = denormalizeObject(state.cuById, cu.sduIDs);
  }

  return cu;
};

const getDenormCollectionWUnits = (state, id) => {
  let c = state.cById[id];
  if (c && Array.isArray(c.cuIDs)) {
    // make a fresh copy, so we won't mess up normalized storage
    c = { ...c };

    c.content_units = c.cuIDs.map(x => getDenormContentUnit(state, x)).filter(x => !!x);
  }

  return c;
};

const mdbSlice = createSlice({
  name        : 'mdb',
  initialState: freshStore(),

  reducers     : {
    fetchUnit       : (state, action) => {
      state.wip.units ||= {};
      state.wip.units[action.payload] = true;
    },
    fetchUnitSuccess: (state, action) => {
      onReceiveContentUnits(state, [action.payload.data]);
      state.wip.units[action.payload.id]     = false;
      state.errors.units[action.payload.id]  = null;
      state.fetched.units[action.payload.id] = true;
    },
    fetchUnitFailure: (state, action) => {
      state.wip.units[action.payload.id]    = false;
      state.errors.units[action.payload.id] = action.payload.err;
    },

    fetchUnitsByIDs       : (state, action) => {
      const units     = action.payload.id?.reduce((acc, id) => ({ ...acc, [id]: true }), {});
      state.wip.units = { ...state.wip.units, ...units };
    },
    fetchUnitsByIDsSuccess: (state, action) => {
      const data = action.payload.data || [];
      onReceiveContentUnits(state, data);
      const units        = data.reduce((acc, { id }) => ({
        wip   : { ...acc.wip, [id]: false },
        errors: { ...acc.errors, [id]: null }
      }), { wip: {}, errors: {} });
      state.wip.units    = { ...state.wip.units, ...units.wip };
      state.errors.units = { ...state.errors.units, ...units.errors };
    },
    fetchUnitsByIDsFailure: (state, action) => {
      const units        = action.payload.id?.reduce((acc, id) => ({
        wip   : { ...acc.wip, [id]: false },
        errors: { ...acc.errors, [id]: action.payload.err }
      }), { wip: {}, errors: {} });
      state.wip.units    = { ...state.wip.units, ...units.wip };
      state.errors.units = { ...state.errors.units, ...units.errors };
    },

    fetchCollection             : (state, action) => {
      state.collections ||= {};
      state.collections[action.payload] = true;
    },
    fetchCollectionSuccess      : (state, action) => {
      onReceiveCollections(state, [action.payload.data]);
      state.wip.collections[action.payload.id]     = false;
      state.errors.collections[action.payload.id]  = null;
      state.fetched.collections[action.payload.id] = true;
    },
    fetchCollectionFailure      : (state, action) => {
      state.wip.collections[action.payload.id]    = false;
      state.errors.collections[action.payload.id] = action.payload.err;
    },
    fetchCollectionsByIDsFailure: (state, action) => {
      const collections        = action.payload.id?.reduce((acc, id) => ({
        wip   : { ...acc.wip, [id]: false },
        errors: { ...acc.errors, [id]: action.payload.err }
      }), { wip: {}, errors: {} });
      state.wip.collections    = { ...state.wip.collections, ...collections.wip };
      state.errors.collections = { ...state.errors.collections, ...collections.errors };
    },

    fetchLatestLesson       : state => void (state.wip.lastLesson = true),
    fetchLatestLessonSuccess: (state, { payload: { data } }) => {
      onReceiveCollections(state, [data]);
      state.lastLessonId                 = data.id;
      state.wip.lastLesson               = false;
      state.errors.lastLesson            = null;
      state.wip.collections[data.id]     = false;
      state.errors.collections[data.id]  = null;
      state.fetched.collections[data.id] = true;
    },
    fetchLatestLessonFailure: (state, action) => {
      state.wip.lastLesson    = false;
      state.errors.lastLesson = action.payload.err;
    },

    fetchWindow       : (state, action) => {
      state.wip.cWindow ||= {};
      state.wip.cWindow[action.payload.id] = true;
    },
    fetchWindowSuccess: (state, action) => {
      onReceiveCollections(state, action.payload.data?.collections);
      onFetchWindow(state, action);
      state.wip.cWindow[action.payload.id]    = false;
      state.errors.cWindow[action.payload.id] = null;
    },
    fetchWindowFailure: (state, action) => {
      state.wip.cWindow    = false;
      state.errors.cWindow = action.payload.err;
    },

    fetchDatepickerCO       : state => void (state.wip.datepickerCO = true),
    fetchDatepickerCOSuccess: (state, { payload: { data: { collections } } }) => {
      onReceiveCollections(state, collections);
      state.datepickerCO        = minBy(collections, a => a.number)?.id;
      state.wip.datepickerCO    = false;
      state.errors.datepickerCO = null;
    },
    fetchDatepickerCOFailure: (state, action) => {
      state.datepickerCO        = null;
      state.wip.datepickerCO    = false;
      state.errors.datepickerCO = action.payload.err;
    },
    nullDatepickerCO        : state => void (state.datepickerCO = null),

    fetchSQData       : state => void (state.wip.sqData = true),
    fetchSQDataSuccess: state => {
      state.wip.sqData    = false;
      state.errors.sqData = null;
    },
    fetchSQDataFailure: {
      prepare: (id, err) => ({ payload: { id, err } }),
      reducer: (state, action) => {
        const { payload = { id: 0 } }  = action;
        state.wip.units[payload.id]    = false;
        state.errors.units[payload.id] = payload.err;
      }
    },

    countCU       : {
      prepare: (type, { namespace, params }) => ({ payload: { namespace, params } }),
      reducer: onCountCU
    },
    countCUSuccess: onCountCUSuccess,
    countCUFailure: (state, action) => {
      state.wip.countCU    = false;
      state.errors.countCU = action.payload.err;
    },

    receiveCollections : (state, action) => onReceiveCollections(state, action.payload),
    receiveContentUnits: (state, action) => onReceiveContentUnits(state, action.payload),

    receivePersons: onReceivePersons,

    createLabel  : () => void ({}),
    receiveLabels: onReceiveLabels,
  },
  extraReducers: builder => {
    builder
      .addCase(ssrActions.prepare, onSSRPrepare)
      .addCase(settingsActions.setContentLanguages, () => freshStore());
  },

  selectors: {
    getCollectionById,
    getWip,
    getErrors,
    nestedGetCollectionById     : state => id => getCollectionById(state, id),
    getUnitById                 : (state, id) => state.cuById[id],
    getLastLessonId             : state => state.lastLessonId,
    getFullUnitFetched          : state => state.fetched.units,
    getFullCollectionFetched    : state => state.fetched.collections,
    getCollections              : state => state.items,
    getWindow                   : state => state.cWindow,
    getDatepickerCO             : state => state.datepickerCO,
    getSQDataWipErr             : state => !(getWip(state).sqData || getErrors(state).sqData),
    getDenormLabel              : state => id => state.labelById[id],
    getCountCu                  : (state, namespace) => state.countCU[namespace],
    skipFetchedCO               : (state, ids) => ids.filter(id => !getDenormCollection(state, id)),
    getLabelsByCU               : (state, id) => state.labelsByCU[id],
    getPersonById               : state => id => state.personById[id],
    getLabelById                : state => state.labelById,
    skipFetchedCU               : (state, ids, with_files) => ids.filter(id => {
      const cu = getDenormContentUnit(state, id);
      if (!with_files) return !cu;
      return !cu?.files?.length;
    }),
    getDenormContentUnit,
    getDenormCollection,
    nestedGetDenormCollection   : state => id => getDenormCollection(state, id),
    getDenormCollectionWUnits,
    nestedGetDenormContentUnit  : state => id => getDenormContentUnit(state, id),
    nestedDenormCollectionWUnits: state => id => getDenormCollectionWUnits(state, id)
  }
});

export default mdbSlice.reducer;

export const { actions } = mdbSlice;

export const types = Object.fromEntries(new Map(
  Object.values(mdbSlice.actions).map(a => [a.type, a.type])
));

export const selectors = mdbSlice.getSelectors();

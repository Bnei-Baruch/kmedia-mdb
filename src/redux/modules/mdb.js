import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import { createAction, handleActions } from 'redux-actions';

import MediaHelper from '../../helpers/media';
import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const FETCH_UNIT                       = 'MDB/FETCH_UNIT';
const FETCH_UNIT_SUCCESS               = 'MDB/FETCH_UNIT_SUCCESS';
const FETCH_UNIT_FAILURE               = 'MDB/FETCH_UNIT_FAILURE';
const FETCH_UNITS_BY_IDS               = 'MDB/FETCH_UNITS_BY_IDS';
const FETCH_UNITS_BY_IDS_SUCCESS       = 'MDB/FETCH_UNITS_BY_IDS_SUCCESS';
const FETCH_UNITS_BY_IDS_FAILURE       = 'MDB/FETCH_UNITS_BY_IDS_FAILURE';
const FETCH_COLLECTION                 = 'MDB/FETCH_COLLECTION';
const FETCH_COLLECTION_SUCCESS         = 'MDB/FETCH_COLLECTION_SUCCESS';
const FETCH_COLLECTION_FAILURE         = 'MDB/FETCH_COLLECTION_FAILURE';
const FETCH_COLLECTIONS_SUCCESS        = 'MDB/FETCH_COLLECTIONS_SUCCESS';
const FETCH_COLLECTIONS_BY_IDS_FAILURE = 'MDB/FETCH_COLLECTIONS_BY_IDS_FAILURE';
const FETCH_LATEST_LESSON              = 'MDB/FETCH_LATEST_LESSON';
const FETCH_LATEST_LESSON_SUCCESS      = 'MDB/FETCH_LATEST_LESSON_SUCCESS';
const FETCH_LATEST_LESSON_FAILURE      = 'MDB/FETCH_LATEST_LESSON_FAILURE';
const FETCH_SQDATA                     = 'MDB/FETCH_SQDATA';
const FETCH_SQDATA_SUCCESS             = 'MDB/FETCH_SQDATA_SUCCESS';
const FETCH_SQDATA_FAILURE             = 'MDB/FETCH_SQDATA_FAILURE';
const FETCH_WINDOW                     = 'MDB/FETCH_WINDOW';
const FETCH_WINDOW_SUCCESS             = 'MDB/FETCH_WINDOW_SUCCESS';
const FETCH_WINDOW_FAILURE             = 'MDB/FETCH_WINDOW_FAILURE';
const FETCH_DATEPICKER_CO              = 'MDB/FETCH_DATEPICKER_CO';
const FETCH_DATEPICKER_CO_SUCCESS      = 'MDB/FETCH_DATEPICKER_CO_SUCCESS';
const FETCH_DATEPICKER_CO_FAILURE      = 'MDB/FETCH_DATEPICKER_CO_FAILURE';
const NULL_DATEPICKER_CO               = 'MDB/NULL_DATEPICKER_CO';
const COUNT_CU                         = 'MDB/COUNT_CU';
const COUNT_CU_SUCCESS                 = 'MDB/COUNT_CU_SUCCESS';
const COUNT_CU_FAILURE                 = 'MDB/COUNT_CU_FAILURE';

const RECEIVE_COLLECTIONS   = 'MDB/RECEIVE_COLLECTIONS';
const RECEIVE_CONTENT_UNITS = 'MDB/RECEIVE_CONTENT_UNITS';

const CREATE_LABEL         = 'MDB/CREATE_LABEL';
const CREATE_LABEL_SUCCESS = 'MDB/CREATE_LABEL_SUCCESS';
const CREATE_LABEL_FAILURE = 'MDB/CREATE_LABEL_FAILURE';
const FETCH_LABELS         = 'MDB/FETCH_LABELS';
const FETCH_LABELS_SUCCESS = 'MDB/FETCH_LABELS_SUCCESS';
const RECEIVE_LABELS       = 'MDB/RECEIVE_LABELS';
const RECEIVE_PERSONS      = 'MDB/RECEIVE_PERSONS';

export const types = {
  FETCH_UNIT,
  FETCH_UNIT_SUCCESS,
  FETCH_UNIT_FAILURE,
  FETCH_UNITS_BY_IDS,
  FETCH_UNITS_BY_IDS_SUCCESS,
  FETCH_UNITS_BY_IDS_FAILURE,
  FETCH_COLLECTION,
  FETCH_COLLECTION_SUCCESS,
  FETCH_COLLECTIONS_BY_IDS_FAILURE,
  FETCH_COLLECTION_FAILURE,
  FETCH_LATEST_LESSON,
  FETCH_LATEST_LESSON_SUCCESS,
  FETCH_LATEST_LESSON_FAILURE,
  FETCH_SQDATA,
  FETCH_SQDATA_SUCCESS,
  FETCH_SQDATA_FAILURE,
  FETCH_WINDOW,
  FETCH_WINDOW_SUCCESS,
  FETCH_WINDOW_FAILURE,
  FETCH_DATEPICKER_CO,
  FETCH_DATEPICKER_CO_SUCCESS,
  FETCH_DATEPICKER_CO_FAILURE,
  NULL_DATEPICKER_CO,
  COUNT_CU,
  COUNT_CU_SUCCESS,
  COUNT_CU_FAILURE,

  RECEIVE_COLLECTIONS,
  RECEIVE_CONTENT_UNITS,
  RECEIVE_LABELS,

  CREATE_LABEL,
  FETCH_LABELS,
  FETCH_LABELS_SUCCESS,

};

/* Actions */

const fetchUnit                    = createAction(FETCH_UNIT);
const fetchUnitSuccess             = createAction(FETCH_UNIT_SUCCESS, (id, data) => ({ id, data }));
const fetchUnitFailure             = createAction(FETCH_UNIT_FAILURE, (id, err) => ({ id, err }));
const fetchUnitsByIDs              = createAction(FETCH_UNITS_BY_IDS);
const fetchUnitsByIDsSuccess       = createAction(FETCH_UNITS_BY_IDS_SUCCESS);
const fetchUnitsByIDsFailure       = createAction(FETCH_UNITS_BY_IDS_FAILURE);
const fetchCollection              = createAction(FETCH_COLLECTION);
const fetchCollectionSuccess       = createAction(FETCH_COLLECTION_SUCCESS, (id, data) => ({ id, data }));
const fetchCollectionFailure       = createAction(FETCH_COLLECTION_FAILURE, (id, err) => ({ id, err }));
const fetchCollectionsByIDsFailure = createAction(FETCH_COLLECTIONS_BY_IDS_FAILURE);
const fetchLatestLesson            = createAction(FETCH_LATEST_LESSON);
const fetchLatestLessonSuccess     = createAction(FETCH_LATEST_LESSON_SUCCESS);
const fetchLatestLessonFailure     = createAction(FETCH_LATEST_LESSON_FAILURE);
const fetchSQData                  = createAction(FETCH_SQDATA);
const fetchSQDataSuccess           = createAction(FETCH_SQDATA_SUCCESS);
const fetchSQDataFailure           = createAction(FETCH_SQDATA_FAILURE);
const fetchWindow                  = createAction(FETCH_WINDOW);
const fetchWindowSuccess           = createAction(FETCH_WINDOW_SUCCESS, (id, data) => ({ id, data }));
const fetchWindowFailure           = createAction(FETCH_WINDOW_FAILURE, (id, err) => ({ id, err }));
const fetchDatepickerCO            = createAction(FETCH_DATEPICKER_CO);
const fetchDatepickerCOSuccess     = createAction(FETCH_DATEPICKER_CO_SUCCESS);
const fetchDatepickerCOFailure     = createAction(FETCH_DATEPICKER_CO_FAILURE, err => ({ err }));
const nullDatepickerCO             = createAction(NULL_DATEPICKER_CO);
const countCU                      = createAction(COUNT_CU, (namespace, params) => ({ namespace, params }));
const countCUSuccess               = createAction(COUNT_CU_SUCCESS, (namespace, total) => ({ namespace, total }));
const countCUFailure               = createAction(COUNT_CU_FAILURE, (namespace, err) => ({ namespace, err }));

const receiveCollections  = createAction(RECEIVE_COLLECTIONS);
const receiveContentUnits = createAction(RECEIVE_CONTENT_UNITS);

const createLabel        = createAction(CREATE_LABEL);
const createLabelSuccess = createAction(CREATE_LABEL_SUCCESS);
const createLabelFailure = createAction(CREATE_LABEL_FAILURE);
const fetchLabels        = createAction(FETCH_LABELS);
const fetchLabelsSuccess = createAction(FETCH_LABELS_SUCCESS);
const receiveLabels      = createAction(RECEIVE_LABELS);
const receivePersons     = createAction(RECEIVE_PERSONS);

export const actions = {
  fetchUnit,
  fetchUnitSuccess,
  fetchUnitFailure,
  fetchUnitsByIDs,
  fetchUnitsByIDsSuccess,
  fetchUnitsByIDsFailure,
  fetchCollection,
  fetchCollectionSuccess,
  fetchCollectionFailure,
  fetchCollectionsByIDsFailure,
  fetchLatestLesson,
  fetchLatestLessonSuccess,
  fetchLatestLessonFailure,
  fetchSQData,
  fetchSQDataSuccess,
  fetchSQDataFailure,
  fetchWindow,
  fetchWindowSuccess,
  fetchWindowFailure,
  fetchDatepickerCO,
  fetchDatepickerCOSuccess,
  fetchDatepickerCOFailure,
  nullDatepickerCO,
  countCU,
  countCUSuccess,
  countCUFailure,

  receiveCollections,
  receiveContentUnits,
  receiveLabels,

  createLabel,
  createLabelSuccess,
  createLabelFailure,
  fetchLabels,
  fetchLabelsSuccess,

  receivePersons
};

/* Reducer */

const freshStore = () => ({
  cById: {},
  cuById: {},
  labelById: {},
  cWindow: {},
  countCU: {},
  labelsByCU: {},
  personById: {},
  datepickerCO: null,
  wip: {
    units: {},
    collections: {},
    cWindow: {},
    datepickerCO: false,
    lastLesson: false,
    sqData: false,
    countCU: false,
  },
  errors: {
    units: {},
    collections: {},
    cWindow: {},
    datepickerCO: null,
    lastLesson: null,
    sqData: null,
    countCU: null,
  },
  fetched: {
    units: {},
    collections: {},
  },
});

/**
 * Set the wip and errors part of the state
 * @param state
 * @param action
 * @returns {{wip: {}, errors: {}}}
 */
const setStatus = (state, action) => {
  const wip     = { ...state.wip };
  const errors  = { ...state.errors };
  const fetched = { ...state.fetched };
  let units     = { errors: {}, wip: {} };
  let collections;

  switch (action.type) {
    case FETCH_UNIT:
      wip.units     = { ...wip.units, [action.payload]: true };
      break;
    case FETCH_UNITS_BY_IDS:
      units.wip = action.payload.id?.reduce((acc, id) => ({ ...acc, [id]: true }), {});
      wip.units = { ...wip.units, ...units.wip };
      break;
    case FETCH_COLLECTION:
      wip.collections = { ...wip.collections, [action.payload]: true };
      break;
    case FETCH_LATEST_LESSON:
      wip.lastLesson = true;
      break;
    case FETCH_WINDOW:
      wip.cWindow = { ...wip.cWindow, [action.payload.id]: true };
      break;
    case FETCH_SQDATA:
      wip.sqData = true;
      break;

    case FETCH_UNIT_SUCCESS:
      wip.units     = { ...wip.units, [action.payload.id]: false };
      errors.units  = { ...errors.units, [action.payload.id]: null };
      fetched.units = { ...fetched.units, [action.payload.id]: true };
      break;
    case FETCH_UNITS_BY_IDS_SUCCESS:
      units        = action.payload?.reduce((acc, { id }) => ({
        wip: { ...acc.wip, [id]: false },
        errors: { ...acc.errors, [id]: null }
      }), { wip: {}, errors: {} });
      wip.units    = { ...wip.units, ...units.wip };
      errors.units = { ...errors.units, ...units.errors };
      break;
    case FETCH_COLLECTION_SUCCESS:
      wip.collections     = { ...wip.collections, [action.payload.id]: false };
      errors.collections  = { ...errors.collections, [action.payload.id]: null };
      fetched.collections = { ...fetched.collections, [action.payload.id]: true };
      break;
    case FETCH_COLLECTIONS_SUCCESS:
      collections        = action.payload?.reduce((acc, { id }) => ({
        wip: { ...acc.wip, [id]: false },
        errors: { ...acc.errors, [id]: null }
      }), { wip: {}, errors: {} });
      wip.collections    = { ...wip.collections, ...collections.wip };
      errors.collections = { ...errors.collections, ...collections.errors };
      break;
    case FETCH_LATEST_LESSON_SUCCESS:
      wip.lastLesson    = false;
      errors.lastLesson = null;

      // update wip & errors map to mark this collection was requested fully (single)
      wip.collections    = { ...wip.collections, [action.payload.id]: false };
      errors.collections = { ...errors.collections, [action.payload.id]: null };
      fetched.collections = { ...fetched.collections, [action.payload.id]: true };
      break;
    case FETCH_WINDOW_SUCCESS:
      wip.cWindow    = { ...wip.cWindow, [action.payload.id]: false };
      errors.cWindow = { ...errors.cWindow, [action.payload.id]: null };
      break;
    case FETCH_DATEPICKER_CO_SUCCESS:
      wip.datepickerCO    = false;
      errors.datepickerCO = null;
      break;
    case FETCH_SQDATA_SUCCESS:
      wip.sqData    = false;
      errors.sqData = null;
      break;

    case FETCH_UNIT_FAILURE:
      wip.units    = { ...wip.units, [action.payload.id]: false };
      errors.units = { ...errors.units, [action.payload.id]: action.payload.err };
      break;
    case FETCH_UNITS_BY_IDS_FAILURE:
      units        = action.payload.id?.reduce((acc, id) => ({
        wip: { ...acc.wip, [id]: false },
        errors: { ...acc.errors, [id]: action.payload.err }
      }), { wip: {}, errors: {} });
      wip.units    = { ...wip.units, ...units.wip };
      errors.units = { ...errors.units, ...units.errors };
      break;
    case FETCH_COLLECTIONS_BY_IDS_FAILURE:
      collections        = action.payload.id?.reduce((acc, id) => ({
        wip: { ...acc.wip, [id]: false },
        errors: { ...acc.errors, [id]: action.payload.err }
      }), { wip: {}, errors: {} });
      wip.collections    = { ...wip.collections, ...collections.wip };
      errors.collections = { ...errors.collections, ...collections.errors };
      break;
    case FETCH_COLLECTION_FAILURE:
      wip.collections    = { ...wip.collections, [action.payload.id]: false };
      errors.collections = { ...errors.collections, [action.payload.id]: action.payload.err };
      break;
    case FETCH_LATEST_LESSON_FAILURE:
      wip.lastLesson    = false;
      errors.lastLesson = action.payload.err;
      break;
    case FETCH_WINDOW_FAILURE:
      wip.cWindow    = { ...wip.cWindow, [action.payload.id]: false };
      errors.cWindow = { ...errors.cWindow, [action.payload.id]: action.payload.err };
      break;
    case FETCH_DATEPICKER_CO_FAILURE:
      wip.datepickerCO    = false;
      errors.datepickerCO = action.payload.err;
      break;
    case FETCH_SQDATA_FAILURE:
      wip.sqData    = false;
      errors.sqData = action.payload.err;
      break;
    case COUNT_CU_FAILURE:
      wip.countCU    = false;
      errors.countCU = action.payload.err;
      break;

    default:
      break;
  }

  return {
    ...state,
    wip,
    errors,
    fetched,
  };
};

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
  }, []).map(f => f.duration ? f : { ...f, duration: unit.duration });

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

const onReceiveCollections = (state, action) => {
  const items = action.payload || [];

  if (items.length === 0) {
    return state;
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

        // we delete it's name_in_collection
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
  return {
    ...state,
    cById,
    cuById
  };
};

const onReceiveContentUnits = (state, action) => {
  const items = action.payload || [];

  if (items.length === 0) {
    return state;
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

  return {
    ...state,
    cById,
    cuById
  };
};

const onReceiveLabels = (state, action) => {
  const labels = action.payload;
  if (labels.length === 0) {
    return state;
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

  return {
    ...state,
    labelsByCU,
    labelById,
  };
};

const onReceivePersons = (state, action) => {
  if (action.payload === 0) {
    return state;
  }

  const personById = action.payload.reduce((acc, { id, name }) => {
    if (!!id) {
      acc[id] = { id, name };
    }

    return acc;
  }, {});

  return { ...state, personById };
};

const onFetchWindow = (state, action) => {
  const { id, data } = action.payload;

  return {
    ...state,
    cWindow: { id, data: (data.collections || []).map(x => x.id) },
  };
};

const onFetchDatepickerCO = (state, action) => {
  const { collections } = action.payload;
  const sorted          = collections.sort((a, b) => a.number - b.number);

  return { ...state, datepickerCO: sorted[0]?.id };
};

const onNullDatepickerCO = state => ({ ...state, datepickerCO: null });

const onSSRPrepare = state => ({
  ...state,
  wip: freshStore().wip,
  errors: {
    units: mapValues(state.errors.units, x => (x ? x.toString() : x)),
    collections: mapValues(state.errors.collections, x => (x ? x.toString() : x)),
    lastLesson: state.errors.lastLesson ? state.errors.lastLesson.toString() : state.errors.lastLesson,
  }
});

const onCountCU = (state, action) => ({
  ...state,
  countCU: {
    ...state.countCU,
    [action.payload.namespace]: {
      ...(state.countCU[action.payload.namespace] || {}),
      wip: true,
    }
  }
});

const onCountCUSuccess = (state, action) => {
  state.wip.countCU    = false;
  state.errors.countCU = null;

  state.countCU = {
    ...state.countCU,
    [action.payload.namespace]: action.payload.total
  };
  return state;
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: freshStore,

  [FETCH_UNIT]: setStatus,
  [FETCH_UNIT_SUCCESS]: (state, action) => (
    setStatus(onReceiveContentUnits(state, { payload: [action.payload.data] }), action)
  ),
  [FETCH_UNIT_FAILURE]: setStatus,
  [FETCH_UNITS_BY_IDS]: setStatus,
  [FETCH_UNITS_BY_IDS_SUCCESS]: (state, action) => (
    setStatus(onReceiveContentUnits(state, { payload: action.payload }), action)
  ),
  [FETCH_UNITS_BY_IDS_FAILURE]: setStatus,
  [FETCH_COLLECTION]: setStatus,
  [FETCH_COLLECTION_SUCCESS]: (state, action) => (
    setStatus(onReceiveCollections(state, { payload: [action.payload.data] }), action)
  ),
  [FETCH_COLLECTION_FAILURE]: setStatus,
  [FETCH_COLLECTIONS_BY_IDS_FAILURE]: setStatus,
  [FETCH_LATEST_LESSON]: setStatus,
  [FETCH_LATEST_LESSON_SUCCESS]: (state, action) => ({
    ...setStatus(onReceiveCollections(state, { payload: [action.payload] }), action),
    lastLessonId: action.payload.id,
  }),
  [FETCH_LATEST_LESSON_FAILURE]: setStatus,
  [FETCH_WINDOW]: setStatus,
  [FETCH_WINDOW_SUCCESS]: (state, action) => (
    setStatus(onFetchWindow(onReceiveCollections(state, { payload: action.payload.data?.collections }), action), action)
  ),
  [FETCH_WINDOW_FAILURE]: setStatus,
  [FETCH_DATEPICKER_CO]: setStatus,
  [FETCH_DATEPICKER_CO_SUCCESS]: (state, action) => (
    setStatus(onFetchDatepickerCO(onReceiveCollections(state, { payload: action.payload.collections }), action), action)
  ),
  [NULL_DATEPICKER_CO]: state => (
    onNullDatepickerCO(state)
  ),
  [FETCH_DATEPICKER_CO_FAILURE]: setStatus,
  [FETCH_SQDATA]: setStatus,
  [FETCH_SQDATA_SUCCESS]: setStatus,
  [FETCH_SQDATA_FAILURE]: setStatus,
  [COUNT_CU]: onCountCU,
  [COUNT_CU_SUCCESS]: onCountCUSuccess,
  [COUNT_CU_FAILURE]: setStatus,

  [RECEIVE_COLLECTIONS]: (state, action) => onReceiveCollections(state, action),
  [RECEIVE_CONTENT_UNITS]: (state, action) => onReceiveContentUnits(state, action),

  [RECEIVE_LABELS]: onReceiveLabels,
  [RECEIVE_PERSONS]: onReceivePersons,
}, freshStore());

/* Selectors */

const getCollectionById        = (state, id) => state.cById[id];
const nestedGetCollectionById  = state => id => getCollectionById(state, id);
const getUnitById              = (state, id) => state.cuById[id];
const getLastLessonId          = state => state.lastLessonId;
const getWip                   = state => state.wip;
const getFullUnitFetched       = state => state.fetched.units;
const getFullCollectionFetched = state => state.fetched.collections;
const getErrors                = state => state.errors;
const getCollections           = state => state.items;
const getWindow                = state => state.cWindow;
const getDatepickerCO          = state => state.datepickerCO;
const getSQDataWipErr          = state => !(getWip(state).sqData || getErrors(state).sqData);

const getDenormCollection = (state, id) => {
  let c = state.cById[id];
  if (c && Array.isArray(c.cuIDs)) {
    // make a fresh copy so we won't mess up normalized storage
    c = { ...c };

    c.content_units = c.cuIDs.map(x => state.cuById[x]).filter(x => !!x);
  }

  return c;
};

const nestedGetDenormCollection = state => id => getDenormCollection(state, id);

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
    // make a fresh copy so we won't mess up normalized storage
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

const nestedGetDenormContentUnit = state => id => getDenormContentUnit(state, id);

const nestedDenormCollectionWUnits = state => id => getDenormCollectionWUnits(state, id);

const getDenormCollectionWUnits = (state, id) => {
  let c = state.cById[id];
  if (c && Array.isArray(c.cuIDs)) {
    // make a fresh copy so we won't mess up normalized storage
    c = { ...c };

    c.content_units = c.cuIDs.map(x => getDenormContentUnit(state, x)).filter(x => !!x);
  }

  return c;
};

const getDenormLabel = state => id => state.labelById[id];

const getCountCu = (state, namespace) => state.countCU[namespace];

const skipFetchedCU = (state, ids, with_files) => ids.filter(id => {
  const cu = getDenormContentUnit(state, id);
  if (!with_files) return !cu;
  return !cu?.files?.length;
});
const skipFetchedCO = (state, ids) => ids.filter(id => !getDenormCollection(state, id));

const getLabelsByCU = (state, id) => state.labelsByCU[id];

const getPersonById = state => id => state.personById[id];

export const selectors = {
  getCollectionById,
  nestedGetCollectionById,
  getUnitById,
  getWip,
  getErrors,
  getFullUnitFetched,
  getFullCollectionFetched,
  getDenormCollection,
  nestedGetDenormCollection,
  getDenormCollectionWUnits,
  nestedDenormCollectionWUnits,
  getDenormContentUnit,
  nestedGetDenormContentUnit,
  getLastLessonId,
  getCollections,
  getWindow,
  getDatepickerCO,
  getSQDataWipErr,
  getCountCu,
  skipFetchedCU,
  skipFetchedCO,
  getLabelsByCU,
  getDenormLabel,
  getPersonById,
};

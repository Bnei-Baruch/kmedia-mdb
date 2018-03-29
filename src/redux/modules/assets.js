import { createAction, handleActions } from 'redux-actions';
import mapValues from 'lodash/mapValues';

import { types as ssr } from './ssr';

const UNZIP            = 'Assets/UNZIP';
const UNZIP_SUCCESS    = 'Assets/UNZIP_SUCCESS';
const UNZIP_FAILURE    = 'Assets/UNZIP_FAILURE';
const DOC2HTML         = 'Assets/DOC2HTML';
const DOC2HTML_SUCCESS = 'Assets/DOC2HTML_SUCCESS';
const DOC2HTML_FAILURE = 'Assets/DOC2HTML_FAILURE';

export const types = {
  UNZIP,
  UNZIP_SUCCESS,
  UNZIP_FAILURE,
  DOC2HTML,
  DOC2HTML_SUCCESS,
  DOC2HTML_FAILURE,
};

/* Actions */

const unzip           = createAction(UNZIP);
const unzipSuccess    = createAction(UNZIP_SUCCESS, (id, data) => ({ id, data }));
const unzipFailure    = createAction(UNZIP_FAILURE, (id, err) => ({ id, err }));
const doc2html        = createAction(DOC2HTML);
const doc2htmlSuccess = createAction(DOC2HTML_SUCCESS, (id, data) => ({ id, data }));
const doc2htmlFailure = createAction(DOC2HTML_FAILURE, (id, err) => ({ id, err }));

export const actions = {
  unzip,
  unzipSuccess,
  unzipFailure,
  doc2html,
  doc2htmlSuccess,
  doc2htmlFailure,
};

/* Reducer */

const initialState = {
  zipIndexById: {},
  doc2htmlById: {},
};

const onSSRPrepare = state => ({
  zipIndexById: mapValues(state.zipIndexById, x => ({ ...x, err: x.err ? x.err.toString() : x.err })),
  doc2htmlById: mapValues(state.doc2htmlById, x => ({ ...x, err: x.err ? x.err.toString() : x.err })),
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [UNZIP]: (state, action) => ({
    ...state,
    zipIndexById: {
      ...state.zipIndexById,
      [action.payload]: { wip: true },
    }
  }),

  [UNZIP_SUCCESS]: (state, action) => {
    const { id, data } = action.payload;
    return {
      ...state,
      zipIndexById: {
        ...state.zipIndexById,
        [id]: { data },
      }
    };
  },

  [UNZIP_FAILURE]: (state, action) => {
    const { id, err } = action.payload;
    return {
      ...state,
      zipIndexById: {
        ...state.zipIndexById,
        [id]: { err },
      },
    };
  },

  [DOC2HTML]: (state, action) => ({
    ...state,
    doc2htmlById: { [action.payload]: { wip: true } }
  }),

  [DOC2HTML_SUCCESS]: (state, action) => {
    const { id, data } = action.payload;
    return {
      ...state,
      doc2htmlById: { [id]: { data } }
    };
  },

  [DOC2HTML_FAILURE]: (state, action) => {
    const { id, err } = action.payload;
    return {
      ...state,
      doc2htmlById: { [id]: { err } }
    };
  },
}, initialState);

/* Selectors */

const getZipIndexById = state => state.zipIndexById;
const getDoc2htmlById = state => state.doc2htmlById;

export const selectors = {
  getZipIndexById,
  getDoc2htmlById,
};

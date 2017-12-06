import { createAction, handleActions } from 'redux-actions';
import { types as settings } from './settings';

/* Types */

const FETCH_TRANSCRIPTION         = 'Transcription/FETCH_TRANSCRIPTION';
const FETCH_TRANSCRIPTION_SUCCESS = 'Transcription/FETCH_TRANSCRIPTION_SUCCESS';
const FETCH_TRANSCRIPTION_FAILURE = 'Transcription/FETCH_TRANSCRIPTION_FAILURE';

export const types = {
  FETCH_TRANSCRIPTION,
  FETCH_TRANSCRIPTION_SUCCESS,
  FETCH_TRANSCRIPTION_FAILURE,
};

/* Actions */

const fetchTranscription        = createAction(FETCH_TRANSCRIPTION);
const fetchTranscriptionSuccess = createAction(FETCH_TRANSCRIPTION_SUCCESS);
const fetchTranscriptionFailure = createAction(FETCH_TRANSCRIPTION_FAILURE);

export const actions = {
  fetchTranscription,
  fetchTranscriptionSuccess,
  fetchTranscriptionFailure,
};

/* Reducer */

const initialState = {
  data: null,
  wip: false,
  error: null,
};

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: () => ({
    ...initialState,
  }),

  [FETCH_TRANSCRIPTION]: state => ({
    ...state,
    wip: true,
  }),

  [FETCH_TRANSCRIPTION_SUCCESS]: (state, action) => ({
    ...state,
    data: action.payload,
    wip: false,
    error: null,
  }),

  [FETCH_TRANSCRIPTION_FAILURE]: (state, action) => ({
    ...state,
    wip: false,
    error: action.payload,
  }),

}, initialState);

/* Selectors */

const getTranscription = state => state;

export const selectors = {
  getTranscription,
};

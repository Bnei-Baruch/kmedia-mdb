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

const fetchTranscription        = createAction(FETCH_TRANSCRIPTION, id => ({ id }));
const fetchTranscriptionSuccess = createAction(FETCH_TRANSCRIPTION_SUCCESS, (id, data) => ({ id, data }));
const fetchTranscriptionFailure = createAction(FETCH_TRANSCRIPTION_FAILURE, (id, err) => ({ id, err }));

export const actions = {
  fetchTranscription,
  fetchTranscriptionSuccess,
  fetchTranscriptionFailure,
};

/* Reducer */

const initialState = {
  transcription: null,
  error: null,
};

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: () => ({
    ...initialState,
  }),

  [FETCH_TRANSCRIPTION_SUCCESS]: (state, action) => ({
    ...state,
    transcription: action.payload,
    error: null,
  }),

  [FETCH_TRANSCRIPTION_FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
  }),

}, initialState);

/* Selectors */

const getTranscription = state => state.transcription;

export const selectors = {
  getTranscription,
};

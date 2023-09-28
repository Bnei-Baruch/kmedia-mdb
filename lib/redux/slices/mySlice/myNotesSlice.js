import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { fetchNotes, addNote, editNote, removeNote } from './thunks';

/* Reducer */
const initialState = {
  ids: [],
  byId: {},
  wip: false,
  errors: null
};

const onFetch = draft => {
  draft.wip    = true;
  draft.errors = false;
  draft.ids    = [];
  draft.byId   = {};
};

const onFetchSuccess = (draft, { payload }) => {
  const { items = [] } = payload;
  draft.wip            = false;
  draft.errors         = false;

  draft.ids  = [];
  draft.byId = {};
  Object.values(items).forEach(x => {
    draft.ids.push(x.id);
    draft.byId[x.id] = x;
  });
};

const onFetchFailure = draft => {
  draft.wip    = false;
  draft.errors = true;
};

const onAddSuccess = (draft, { payload }) => {
  const { item }      = payload;
  draft.byId[item.id] = item;
  draft.ids           = [item.id, ...draft.ids];
  draft.wip           = false;
  draft.errors        = false;
};

const onEditSuccess = (draft, { payload }) => {
  const { item }      = payload;
  draft.byId[item.id] = item;
  draft.wip           = false;
  draft.errors        = false;
};

const onRemoveSuccess = (draft, { payload }) => {
  const { id }   = payload;
  draft.ids      = draft.ids.filter(k => k !== id);
  draft.byId[id] = null;
  draft.deleted  = true;
  draft.wip      = false;
  draft.errors   = false;
};

export const myNotesSlice = createSlice({
  name: 'notes',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload.notes, };
    });
    builder.addCase(fetchNotes.fulfilled, onFetchSuccess);
    builder.addCase(fetchNotes.rejected, onFetchFailure);

    builder.addCase(addNote.fulfilled, onAddSuccess);
    builder.addCase(editNote.fulfilled, onEditSuccess);
    builder.addCase(removeNote.fulfilled, onRemoveSuccess);
  }
});

/* Selectors */
const getList = state => state.ids;
const getById = (state, id) => {
  return state.byId[id];
};
const getWIP  = state => state.wip;
const getErr  = state => state.errors;

export const selectors = {
  getList,
  getById,
  getWIP,
  getErr,
};

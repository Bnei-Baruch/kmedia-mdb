import { createSlice } from '@reduxjs/toolkit';

const myNotesService = createSlice({
  name        : 'myNotes',
  initialState: {
    ids   : [],
    byId  : {},
    wip   : false,
    errors: null
  },

  reducers: {
    fetch         : state => {
      state.wip    = true;
      state.errors = false;
      state.ids    = [];
      state.byId   = {};
    },
    fetchSuccess  : (state, { payload: { items } }) => {
      state.wip    = false;
      state.errors = false;

      state.ids  = [];
      state.byId = {};
      Object.values(items).forEach(x => {
        state.ids.push(x.id);
        state.byId[x.id] = x;
      });
    },
    onFetchFailure: state => {
      state.wip    = false;
      state.errors = true;
    },

    add          : {
      prepare: (content, properties) => ({ payload: { content, ...properties } }),
      reducer: () => void ({})
    },
    addSuccess   : (state, { payload: { item } }) => {
      state.byId[item.id] = item;
      state.ids           = [item.id, ...state.ids];
      state.wip           = false;
      state.errors        = false;
    },
    edit         : {
      prepare: (content, id) => ({ payload: { content, id } }),
      reducer: () => void ({})
    },
    editSuccess  : (state, { payload: { item } }) => {
      state.byId[item.id] = item;
      state.wip           = false;
      state.errors        = false;
    },
    remove       : () => void ({}),
    removeSuccess: (state, { payload: id }) => {
      state.ids      = state.ids.filter(k => k !== id);
      state.byId[id] = null;
      state.deleted  = true;
      state.wip      = false;
      state.errors   = false;
    }
  }
});

export default myNotesService.reducer;

export const { actions } = myNotesService;

export const types = Object.fromEntries(new Map(
  Object.values(myNotesService.actions).map(a => [a.type, a.type])
));

/* Selectors */
const getList = state => state.ids || [];
const getById = (state, id) => state.byId[id];

const getWIP = state => state.wip;
const getErr = state => state.errors;

export const selectors = {
  getList,
  getById,
  getWIP,
  getErr
};

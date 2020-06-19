import { createAction } from 'redux-actions';
import produce from 'immer';

import { DEFAULT_LANGUAGE } from '../../helpers/consts';
import { getQuery } from '../../helpers/url';

/* Helpers */

export const handleActions = (actionsMap, defaultState) =>
  (
    state = defaultState,
    { type, payload }
  ) =>
    produce(state, draft => {
      const action = actionsMap[type];
      action && action(draft, payload, type);
    });

/* Types */

const SET_LANGUAGE         = 'Settings/SET_LANGUAGE';
const SET_CONTENT_LANGUAGE = 'Settings/SET_CONTENT_LANGUAGE';
const SET_PAGE_SIZE        = 'Settings/SET_PAGE_SIZE';

export const types = {
  SET_LANGUAGE,
  SET_CONTENT_LANGUAGE,
  SET_PAGE_SIZE,
};

/* Actions */

const setLanguage        = createAction(SET_LANGUAGE);
const setContentLanguage = createAction(SET_CONTENT_LANGUAGE);
const setPageSize        = createAction(SET_PAGE_SIZE);

export const actions = {
  setLanguage,
  setContentLanguage,
  setPageSize,
};

/* Reducer */
export const initialState = {
  language: DEFAULT_LANGUAGE,
  contentLanguage: DEFAULT_LANGUAGE,
  pageSize: 10,
};

const onSetLanguage = (draft, payload) => {
  draft.language = payload;
};

const onSetContentLanguage = (draft, payload) => {
  draft.contentLanguage = payload;
};

const onSetPageSize = (draft, payload) => {
  draft.pageSize = payload;
};

export const reducer = handleActions({
  [SET_LANGUAGE]: onSetLanguage,
  [SET_CONTENT_LANGUAGE]: onSetContentLanguage,
  [SET_PAGE_SIZE]: onSetPageSize,
}, initialState);

/* Selectors */

const getLanguage        = state => state.language;
const getContentLanguage = state => getQuery(window.location)?.language || state.contentLanguage || state.language;
const getPageSize        = state => state.pageSize;

export const selectors = {
  getLanguage,
  getContentLanguage,
  getPageSize,
};

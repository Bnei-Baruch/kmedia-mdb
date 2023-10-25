import Api from '../../../../src/helpers/Api';
import { mdbSlice } from '../mdbSlice';
import { preparePageSlice, selectors } from './preparePageSlice';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { MAX_PAGE_SIZE } from '@/src/helpers/consts';
import { createAsyncThunk } from '@reduxjs/toolkit';

const DEF_PARAMS = { pageNo: 1, pageSize: MAX_PAGE_SIZE, with_units: false };

export const fetchPreparePage = createAsyncThunk(
  'preparePage/fetch',
  async (payload, thunkAPI) => {
    const { namespace, ...params } = payload;

    const state = thunkAPI.getState();

    // fetch once
    if (selectors.wasFetchedByNS(state.preparePage, namespace)) return;

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);
    const { data }         = await Api.collections({
      ...DEF_PARAMS,
      ui_lang: uiLang,
      content_languages: contentLanguages,
      ...params
    });

    if (Array.isArray(data.collections)) {
      thunkAPI.dispatch(mdbSlice.actions.receiveCollections(data.collections));
    }
    return { namespace };
  }
);

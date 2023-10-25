import Api from '/src/helpers/Api';
import { mdbSlice } from '../mdbSlice';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { selectors as filterSelectors } from '../filterSlice/filterSlice';
import { isEmpty } from '/src/helpers/utils';
import { PAGE_NS_SIMPLE_MODE } from '@/src/helpers/consts';
import { filtersTransformer } from '@/lib/filters';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSimpleMode = createAsyncThunk(
  'simpleMode/fetch',
  async (payload, thunkAPI) => {
    const state        = thunkAPI.getState();
    const filters      = filterSelectors.getNSFilters(state.filters, PAGE_NS_SIMPLE_MODE);
    const filterParams = filtersTransformer.toApiParams(filters);

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const args = {
      ...filterParams,
      ui_language: uiLang,
      content_languages: contentLanguages,
    };

    const { data } = await Api.simpleMode(args);

    if (!isEmpty(data.lessons)) {
      thunkAPI.dispatch(mdbSlice.actions.receiveCollections(data.lessons));
    }

    if (!isEmpty(data.others)) {
      thunkAPI.dispatch(mdbSlice.actions.receiveContentUnits(data.others));
    }

    return data;
  }
);

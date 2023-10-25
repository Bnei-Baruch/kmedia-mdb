import Api from '../../../../src/helpers/Api';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { mdbSlice } from '../mdbSlice/mdbSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchHome = createAsyncThunk(
  'home/fetchData',
  async (_, thunkAPI) => {
    const state            = thunkAPI.getState();
    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const { data } = await Api.home({ ui_language: uiLang, content_languages: contentLanguages });
    thunkAPI.dispatch(mdbSlice.actions.receiveCollections([data.latest_daily_lesson, ...data.latest_cos]));
    thunkAPI.dispatch(mdbSlice.actions.receiveContentUnits(data.latest_units));
    return data;
  }
);

export const fetchBanners = createAsyncThunk(
  'Home/fetchBanners',
  async (contentLanguages) => {
    const { data } = await Api.getCMS('banner', { contentLanguages });
    return data;
  }
);


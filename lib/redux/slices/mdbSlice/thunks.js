import Api from '../../../../src/helpers/Api';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { actions as mdb } from '../mdbSlice/mdbSlice';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';

export const fetchData = createAppAsyncThunk(
  'Home/fetchData',
  async (_, thunkAPI) => {
    const state            = thunkAPI.getState();
    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    console.log('fetchData home', uiLang, contentLanguages);
    const { data } = await Api.home({ ui_language: uiLang, content_languages: contentLanguages, });
    thunkAPI.dispatch(mdb.receiveCollections([data.latest_daily_lesson, ...data.latest_cos]));
    thunkAPI.dispatch(mdb.receiveContentUnits(data.latest_units));
    return data;
  }
);

export const fetchBanners = createAppAsyncThunk(
  'Home/fetchBanners',
  async (contentLanguages) => {
    const { data } = await Api.getCMS('banner', { contentLanguages });
    return data;
  }
);


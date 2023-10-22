import Api from '../../../../src/helpers/Api';
import { CT_SONGS } from '@/src/helpers/consts';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { mdbSlice } from '../mdbSlice/mdbSlice';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';

export const fetchMusic = createAppAsyncThunk(
  'music/fetch',
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);
    const args             = {
      content_type: CT_SONGS,
      ui_language: uiLang,
      content_languages: contentLanguages,
      pageNo: 1,
      pageSize: 1000, // NOTE: we need to get all data, and the endpoint lets us fetch only with pagination,
      with_units: false,
    };
    const { data }         = await Api.collections(args);

    thunkAPI.dispatch(mdbSlice.actions.receiveCollections(data.collections));
    return data.collections.map(c => c.id);
  }
);

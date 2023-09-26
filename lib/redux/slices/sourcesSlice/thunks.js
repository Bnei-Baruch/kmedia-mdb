import Api from '/src/helpers/Api';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { createAppAsyncThunk } from '/lib/redux/createAppAsyncThunk';
import { tagsSlice } from '../tagsSlice';
import { publicationsSlice } from '../publicationsSlice';
import { actions as mdb, mdbSlice } from '../mdbSlice/mdbSlice';

export const fetchSQData = createAppAsyncThunk(
  'sources/fetchSQData',
  async (params, thunkAPI) => {
    const state = thunkAPI.getState();

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const { data } = await Api.sqdata({ ui_language: uiLang, content_languages: contentLanguages });

    thunkAPI.dispatch(mdbSlice.actions.receivePersons(data.persons));
    thunkAPI.dispatch(tagsSlice.actions.receiveTags(data.tags));
    thunkAPI.dispatch(publicationsSlice.actions.receivePublishers(data.publishers));
    return { sources: data.sources, uiLang };
  }
);

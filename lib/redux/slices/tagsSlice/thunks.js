import Api from '@/src/helpers/Api';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { selectors as filterSelectors } from '@/lib/redux/slices/filterSlice/filterSlice';
import { filtersTransformer } from 'lib/filters';
import { fetchCollections, fetchLabels, fetchUnitsByIDs } from '@/lib/redux/slices/mdbSlice/thunks';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTags = createAsyncThunk(
  'tags/fetch',
  async (payload, thunkAPI) => {
    const { namespace, ...params } = payload;
    const state                    = thunkAPI.getState();
    const filters                  = filterSelectors.getNSFilters(state.filters, namespace);
    const filterParams             = filtersTransformer.toApiParams(filters);

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const { data } = await Api.tagDashboard({
      ...params,
      ...filterParams,
      ui_language: uiLang,
      content_languages: contentLanguages,
    });

    const { items, media_total, text_total } = data;

    const cuIDs    = items.map(x => x.content_unit_id);
    const cIDs     = items.map(x => x.collection_id).filter(x => !!x);
    const labelIDs = items.map(x => x.label_id).filter(x => !!x);
    const list     = items.map(({ content_unit_id, label_id, collection_id, is_text }) => ({
      cuID: content_unit_id ?? null,
      cID: collection_id ?? null,
      lID: label_id ?? null,
      isText: is_text ?? false
    }));

    const requests = [];

    requests.push(thunkAPI.dispatch(fetchUnitsByIDs({ id: cuIDs })));

    requests.push(thunkAPI.dispatch(fetchCollections({ id: cIDs })));
    requests.push(thunkAPI.dispatch(fetchLabels({ id: labelIDs })));
    //requests.push(fetchViewsByUIDs(items.filter(x => !x.is_text).map(x => x.content_unit_id)));
    await Promise.all(requests);

    return ({ items: list, mediaTotal: media_total, textTotal: text_total });
  }
);
